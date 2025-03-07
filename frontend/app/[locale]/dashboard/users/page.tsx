"use client";
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useUpdateUserRoleMutation,
} from "@/redux/api/userApiSlice";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Dropdown, Form, Input, Modal, Popconfirm, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props = {};

const page = (props: Props) => {
  const [form] = Form.useForm();
  const [targetRow, setTargetRow] = useState<number | null>(null);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { data: getAllUsersData, refetch: getAllUsersRefetch } =
    useGetAllUsersQuery(undefined, {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    });

  const [
    updateUserRoleFn,
    {
      isLoading: updateUserRoleIsLoading,
      isSuccess: updateUserRoleIsSuccess,
      isError: updateUserRoleIsError,
      error: updateUserRoleError,
      data: updateUserRoleData,
    },
  ] = useUpdateUserRoleMutation();

  const [
    deleteUserFn,
    {
      isLoading: deleteUserIsLoading,
      isSuccess: deleteUserIsSuccess,
      isError: deleteUserIsError,
      error: deleteUserError,
      data: deleteUserData,
    },
  ] = useDeleteUserMutation();

  const [
    createUserFn,
    {
      isLoading: createUserIsLoading,
      isSuccess: createUserIsSuccess,
      isError: createUserIsError,
      error: createUserError,
      data: createUserData,
    },
  ] = useCreateUserMutation();

  const [
    updateUserFn,
    {
      isLoading: updateUserIsLoading,
      isSuccess: updateUserIsSuccess,
      isError: updateUserIsError,
      error: updateUserError,
      data: updateUserData,
    },
  ] = useUpdateUserMutation();

  const roles = [
    {
      key: "admin",
      label: <p>Admin</p>,
    },
    {
      key: "editor",
      label: <p>Editor</p>,
    },
  ];

  const handleUpdateUserRoles = async (userId: number, role: string) => {
    setTargetRow(userId);
    try {
      await updateUserRoleFn({
        userId,
        role,
      }).unwrap();
      setTargetRow(null);
    } catch (error) {
      console.error(error);
      setTargetRow(null);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUserFn(userId).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (currentUser) {
        await updateUserFn({
          userId: currentUser.id,
          role: values.role,
          firstname: values.firstname || "",
          lastname: values.lastname || "",
        }).unwrap();
      } else {
        await createUserFn({
          email: values.email,
          role: values.role,
          firstname: values.firstname || "",
          lastname: values.lastname || "",
        }).unwrap();
      }
    } catch (error) {
      console.error(error);
    }

    setIsOpenModal(false);
    setCurrentUser(null);
    form.resetFields();
  };

  const userColumn = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: any, record: any) => {
        return <>{text || "-"}</>;
      },
    },
    {
      title: "Firstname",
      dataIndex: "firstname",
      key: "firstname",
      render: (text: any, record: any) => {
        return <>{text || "-"}</>;
      },
    },
    {
      title: "Lastname",
      dataIndex: "lastname",
      key: "lastname",
      render: (text: any, record: any) => {
        return <>{text || "-"}</>;
      },
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text: string) => text,
    },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: any) => {
        return (
          <div className="flex items-center gap-4">
            {/* role switcher */}
            {targetRow === record?.id && updateUserRoleIsLoading ? (
              <div className="animate-spin border-t-2 border-white border-solid rounded-full w-5 h-5"></div>
            ) : (
              <Dropdown
                menu={{
                  items: roles.map((role) => ({
                    ...role,
                    label: (
                      <div
                        onClick={() =>
                          handleUpdateUserRoles(record?.id, role.key)
                        }
                        className={`px-2 py-1 ${
                          role.key === record.role?.toLocaleLowerCase()
                            ? "text-red-500"
                            : ""
                        }`}
                      >
                        {role.label}
                      </div>
                    ),
                  })),
                }}
                trigger={["click"]}
              >
                <UserSwitchOutlined className="text-gray-500 cursor-pointer" />
              </Dropdown>
            )}

            {/* edit */}
            <EditOutlined
              onClick={() => {
                setCurrentUser(record);
                setIsOpenModal(true);
              }}
              className="cursor-pointer text-gray-500"
            />

            {/* delete */}
            {deleteUserIsLoading ? (
              <div className="animate-spin border-t-2 border-white border-solid rounded-full w-5 h-5"></div>
            ) : (
              <Popconfirm
                title="Are you sure?"
                onConfirm={() => handleDeleteUser(record?.id)}
              >
                <DeleteOutlined className="cursor-pointer text-gray-500" />
              </Popconfirm>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (currentUser) {
      form.setFieldsValue({
        firstname: currentUser.firstname,
        lastname: currentUser.lastname,
        role: currentUser.role,
      });
    }
  }, [currentUser, form]);

  useEffect(() => {
    if (updateUserRoleIsSuccess) {
      toast.success("User updated successfully");
      getAllUsersRefetch();
    }

    if (updateUserRoleIsError) {
      const customError = updateUserRoleError as {
        data: any;
        status: number;
      };
      toast.error(customError.data.message);
    }
  }, [
    updateUserRoleIsSuccess,
    updateUserRoleIsError,
    updateUserRoleError,
    updateUserRoleData,
  ]);

  useEffect(() => {
    if (updateUserIsSuccess) {
      toast.success("User updated successfully");
      getAllUsersRefetch();
    }

    if (updateUserIsError) {
      const customError = updateUserError as {
        data: any;
        status: number;
      };
      toast.error(customError.data.message);
    }
  }, [updateUserIsSuccess, updateUserIsError, updateUserError, updateUserData]);

  useEffect(() => {
    if (createUserIsSuccess) {
      toast.success("User created successfully");
      getAllUsersRefetch();
    }

    if (createUserIsError) {
      const customError = createUserError as {
        data: any;
        status: number;
      };
      toast.error(customError.data.message);
    }
  }, [createUserIsSuccess, createUserIsError, createUserError, createUserData]);

  useEffect(() => {
    if (deleteUserIsSuccess) {
      toast.success("User deleted successfully");
      getAllUsersRefetch();
    }

    if (deleteUserIsError) {
      const customError = deleteUserError as {
        data: any;
        status: number;
      };
      toast.error(customError.data.message);
    }
  }, [deleteUserIsSuccess, deleteUserIsError, deleteUserError, deleteUserData]);

  return (
    <section className="flex flex-col gap-10">
      <div className="p-6 bg-white dark:bg-[#1e293b] shadow-md rounded-md">
        <p className="text-[22px] text-secondaryShade dark:text-primaryShade font-bold uppercase mb-6">
          Users
        </p>

        <div>
          <button
            onClick={() => {
              setIsOpenModal(true);
              form.resetFields();
              setCurrentUser(null);
            }}
            type="button"
            className="mb-4 px-6 py-2 rounded-md text-white cursor-pointer flex gap-2 items-center justify-center bg-secondaryShade dark:bg-primaryShade border border-secondaryShade dark:border-primaryShade hover:bg-transparent hover:text-secondaryShade dark:hover:bg-transparent dark:hover:text-primaryShade transition-colors duration-300"
          >
            <PlusOutlined className="text-lg" />
            <p className="uppercase font-medium text-sm">Create User</p>
          </button>

          <Table
            columns={userColumn}
            dataSource={getAllUsersData?.data}
            scroll={{ x: 768 }}
            className=""
          />
        </div>
      </div>

      <Modal
        onCancel={() => {
          setIsOpenModal(false);
          setCurrentUser(null);
          form.resetFields();
        }}
        onClose={() => {
          setIsOpenModal(false);
          setCurrentUser(null);
          form.resetFields();
        }}
        open={isOpenModal}
        footer={null}
      >
        <Form onFinish={handleSubmit} layout="vertical" form={form}>
          {/* EMAIL */}
          {currentUser ? (
            <Form.Item label="Email">
              <Input
                defaultValue={currentUser?.email}
                disabled
                size="large"
                placeholder="Enter User Email"
              />
            </Form.Item>
          ) : (
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  type: "email",
                  message: "The input is not a valid email!",
                },
                {
                  required: true,
                  message: "User email is required!",
                },
              ]}
            >
              <Input size="large" placeholder="Enter User Email" />
            </Form.Item>
          )}

          {/* ROLE */}
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "User role is required!" }]}
          >
            <Select
              size="large"
              placeholder="Select User Role"
              allowClear
              options={roles?.map((role) => ({
                label:
                  role.key.charAt(0).toLocaleUpperCase() + role.key.slice(1),
                value: role.key,
              }))}
            />
          </Form.Item>

          {/* FIRSTNAME */}
          <Form.Item label="Firstname" name="firstname">
            <Input size="large" placeholder="Enter User Firstname" />
          </Form.Item>

          {/* LASTNAME */}
          <Form.Item label="Lastname" name="lastname">
            <Input size="large" placeholder="Enter User Lastname" />
          </Form.Item>
        </Form>
        <button
          onClick={() => form.submit()}
          type="button"
          className="ml-auto mt-2 px-6 py-2 rounded-md text-white cursor-pointer flex items-center justify-center bg-secondaryShade dark:bg-primaryShade border border-secondaryShade dark:border-primaryShade hover:bg-transparent hover:text-secondaryShade dark:hover:bg-transparent dark:hover:text-primaryShade transition-colors duration-300"
          disabled={createUserIsLoading}
        >
          {createUserIsLoading ? (
            <div className="animate-spin border-t-2 border-white border-solid rounded-full w-5 h-5"></div> // Spinner
          ) : (
            <p className="uppercase font-medium">
              {currentUser ? "Save" : "Submit"}
            </p>
          )}
        </button>
      </Modal>
    </section>
  );
};

export default page;
