"use client";
import { Link } from "@/i18n/routing";
import { useLoginMutation } from "@/redux/api";
import { LoginOutlined } from "@ant-design/icons";
import { Form, Input } from "antd";
import FormItem from "antd/es/form/FormItem";
import Password from "antd/es/input/Password";
import React from "react";

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

  const [login] = useLoginMutation();

  const handleSubmit = (values: any) => {
    login({ email: values.email, password: values.password });
  };
  return (
    <div className="bg-white relative max-w-[500px] w-[90%] flex flex-col border rounded-lg shadow-shadow-2 bg-login-box p-3">
      <div className="p-3 rounded-lg grid place-items-center bg-white shadow-shadow-1 w-fit mx-auto mb-4">
        <LoginOutlined className="text-2xl" />
      </div>

      <p className="text-xl font-semibold text-center">
        Sign in to Island Green CMS
      </p>
      <p className="text-sm font-normal text-[#666] text-center">
        Here, you have the power to manage, customize, and create your data
        effortlessly, all in one centralized space.
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

        <div className="">
          <FormItem
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              {
                pattern:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                message:
                  "Password must contain minimum eight characters, at least one letter, one number and one special character",
              },
            ]}
          >
            <Password
              className="bg-gray-200"
              placeholder="Password"
              size="large"
            />
          </FormItem>
          <Link
            href="/auth/forgot-password"
            className="block w-fit ml-auto mt-1 text-sm font-medium text-[#666] cursor-pointer hover:text-red-500 transition-colors duration-300"
          >
            Forgot Password?
          </Link>
        </div>
        <button className="bg-black h-[39.6px] text-white py-[7px] px-[11px] rounded-[8px] flex justify-center items-center gap-2">
          <p className="font-medium">Login</p>
        </button>
      </Form>
    </div>
  );
};

export default page;
