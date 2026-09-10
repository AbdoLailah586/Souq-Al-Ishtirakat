-- ==============================================================================
-- حذف المستخدم بالكامل من auth.users (وبالتبعية من profiles بسبب CASCADE)
-- يجب تشغيل هذا في Supabase SQL Editor
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.admin_delete_user(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_role TEXT;
BEGIN
  -- التحقق من أن المُستدعي أدمن
  SELECT role INTO v_caller_role
  FROM public.profiles
  WHERE id = auth.uid();

  IF v_caller_role IS DISTINCT FROM 'admin' THEN
    RETURN jsonb_build_object('success', false, 'error', 'unauthorized');
  END IF;

  -- لا يمكن حذف نفسك
  IF p_user_id = auth.uid() THEN
    RETURN jsonb_build_object('success', false, 'error', 'cannot_delete_self');
  END IF;

  -- الحذف من auth.users يمسح profiles تلقائياً بسبب ON DELETE CASCADE
  DELETE FROM auth.users WHERE id = p_user_id;

  -- التحقق من نجاح الحذف
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'user_not_found');
  END IF;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- منح الصلاحية لـ authenticated users (الدالة نفسها تتحقق من الدور)
GRANT EXECUTE ON FUNCTION public.admin_delete_user(UUID) TO authenticated;
