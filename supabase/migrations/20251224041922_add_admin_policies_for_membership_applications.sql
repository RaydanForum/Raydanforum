/*
  # إضافة سياسات RLS للأدمن لطلبات العضوية

  ## التغييرات
  
  ### سياسات RLS الجديدة
  - إضافة سياسة SELECT للمستخدمين المصادق عليهم (الأدمن) لقراءة جميع الطلبات
  - إضافة سياسة UPDATE للمستخدمين المصادق عليهم (الأدمن) لتحديث حالة الطلبات

  ## الملاحظات
  - السياسات الحالية للـ anon (الزوار) تبقى كما هي لإرسال الطلبات
  - الأدمن يحتاج إلى صلاحيات إضافية للقراءة والتحديث
*/

-- إضافة سياسة SELECT للأدمن
CREATE POLICY "Authenticated users can view all applications"
  ON membership_applications
  FOR SELECT
  TO authenticated
  USING (true);

-- إضافة سياسة UPDATE للأدمن
CREATE POLICY "Authenticated users can update applications"
  ON membership_applications
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
