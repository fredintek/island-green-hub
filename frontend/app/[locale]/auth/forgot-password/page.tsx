"use client";
import { useRouter } from "@/i18n/routing";
import { useForgotPasswordMutation } from "@/redux/api";
import { UnlockOutlined } from "@ant-design/icons";
import { Form, Input } from "antd";
import FormItem from "antd/es/form/FormItem";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

type Props = {};

const customizeRequiredMark = (
  label: React.ReactNode,
  { required }: { required: boolean }
) => (
  <>
    {label}
    {required && <span className="text-red-500 ml-[2px]">*</span>}
  </>
);

const page = (props: Props) => {
  const [form] = Form.useForm();
  const router = useRouter();

  const [forgotPassword, { isError, isLoading, isSuccess, data, error }] =
    useForgotPasswordMutation();

  const handleSubmit = (values: any) => {
    forgotPassword({ email: values.email });
  };

  useEffect(() => {
    if (isSuccess) {
      router.replace(`/auth/reset-password`);
      toast.success(data.message);
    }

    if (isError) {
      const customError = error as { data: any; status: number };
      toast.error(customError.data.message);
    }
  }, [isSuccess, isError, error, data]);
  return (
    <div className="bg-white relative max-w-[500px] w-[90%] flex flex-col border rounded-lg shadow-shadow-2 bg-login-box p-3">
      <div className="p-3 rounded-lg grid place-items-center bg-white shadow-shadow-1 w-fit mx-auto mb-4">
        <UnlockOutlined className="text-2xl" />
      </div>

      <p className="text-xl font-semibold text-center">Forgot Password</p>
      <p className="text-sm font-normal text-[#666] text-center">
        Don’t worry, we’ve got you covered! Enter your email to receive
        instructions on how to reset your password and regain access to your
        account.
      </p>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4 flex flex-col gap-4"
        requiredMark={customizeRequiredMark}
      >
        <div className="">
          <FormItem
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                type: "email",
                message: "The input is not a valid email!",
              },
            ]}
          >
            <Input
              className="bg-gray-200"
              placeholder="Email Address"
              size="large"
            />
          </FormItem>
        </div>
        <button className="bg-black h-[39.6px] text-white py-[7px] px-[11px] rounded-[8px] flex justify-center items-center gap-2">
          <p className="font-medium">Forgot Password</p>
        </button>
      </Form>
    </div>
  );
};

export default page;
