'use client'

import { Layout } from 'antd';
const { Footer } = Layout;

const AdminFooter = () => {
    const { Footer } = Layout;
    return (
        <>
            <Footer style={{ textAlign: 'center' }}>
                FullStack ©{new Date().getFullYear()} Created by @DuyLong
            </Footer>
        </>
    )
}

export default AdminFooter;