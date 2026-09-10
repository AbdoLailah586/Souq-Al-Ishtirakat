# إعداد SMTP المخصص في Supabase (Gmail)

## بيانات الإعداد

| الحقل | القيمة |
|-------|--------|
| SMTP Host | `smtp.gmail.com` |
| SMTP Port | `587` |
| SMTP Username | `abdolailah586@gmail.com` |
| SMTP Password | `zjom bkex fkps eoxk` |
| Sender Name | `سوق الاشتراكات` |
| Sender Email | `abdolailah586@gmail.com` |
| Encryption | TLS (STARTTLS) |

---

## الخطوات في لوحة تحكم Supabase

1. افتح: https://supabase.com/dashboard/project/vkykqtkgettxqennesxt/settings/auth
2. انزل لقسم "SMTP Settings"
3. فعّل "Enable Custom SMTP"
4. ادخل البيانات أعلاه
5. اضغط "Save"

---

## قالب إيميل التفعيل المخصص

في نفس الصفحة، انزل لـ "Email Templates" ثم اختر "Confirm signup"

Subject: تأكيد حسابك في سوق الاشتراكات

Body: HTML مخصص موجود في الملف email_confirm_template.html

---

## اختبار الإعداد

بعد الحفظ:
1. سجّل حساب جديد من الموقع
2. افحص البريد abdolailah586@gmail.com في "Sent" للتأكيد
3. تحقق أن المستخدم استلم الرسالة
