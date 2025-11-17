'use client'

import { AdminContext } from "@/library/admin.context";
import { DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SmileOutlined } from "@ant-design/icons";
import { Button, Dropdown, Layout, MenuProps, Space } from "antd";
import { useContext } from "react";
import { signOut } from "next-auth/react";

const AdminHeader = (prop: any) => {
    // const { data: session, status } = useSession();
    const { session } = prop;

    const { Header } = Layout;
    const { collapseMenu, setCollapseMenu } = useContext(AdminContext)!;

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <span>
                    Setting
                </span>
            ),
        },
        {
            key: '2',
            danger: true,
            label: <span onClick={() => signOut()}>Đăng xuất</span>,
        },
    ];

    return (
        <>
            <Header
                style={{
                    padding: 0,
                    display: "flex",
                    background: "#f5f5f5",
                    justifyContent: "space-between",
                    alignItems: "center"
                }} >

                <Button
                    type="text"
                    icon={collapseMenu ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapseMenu(!collapseMenu)}
                    style={{
                        fontSize: '16px',
                        width: 64,
                        height: 64,
                    }}
                />
                <Dropdown menu={{ items }} >
                    <a onClick={(e) => e.preventDefault()}
                        style={{ color: "unset", lineHeight: "0 !important", marginRight: 20 }}
                    >
                        <Space>
                            Welcome {session?.user?.email ?? "Guest"}
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
            </Header >
        </>
    )
}

export default AdminHeader;