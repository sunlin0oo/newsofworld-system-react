import React, { forwardRef, useEffect, useState } from 'react'
import { Form, Input, Select } from 'antd'
// 可以通过forwardRef在父组件所创建的ref对象透传到子组件的对象上，相当于把子的函数方法给了父亲，回调函数进行处理
const UserForm = forwardRef((props, ref) => {
    const [isDisable, setIsDisable] = useState(false);
    useEffect(() => {
        setIsDisable(props.isUpdateDisable)
    }, [props.getTimes, props.isUpdateDisable])
    return (
        <div>
            <Form
                ref={ref}
                layout="vertical"
            >
                <Form.Item
                    name="username"
                    label="用户名"
                    rules={[{ required: true, message: 'Please input the username of collection!' }]}
                >
                    <Input></Input>
                </Form.Item>
                <Form.Item
                    name="password"
                    label="密码"
                    rules={[{ required: true, message: 'Please input the password of collection!' }]}
                >
                    <Input></Input>
                </Form.Item>
                <Form.Item
                    name="region"
                    label="区域"
                    rules={isDisable ? [] : [{ required: true, message: 'Please input the region of collection!' }]}
                >
                    <Select
                        disabled={isDisable}
                        options={props.reigonList}
                    />
                </Form.Item>
                <Form.Item
                    name="roleName"
                    label="角色"
                    rules={[{ required: true, message: 'Please input the role of collection!' }]}
                >
                    <Select
                        options={props.roleList}
                        // 这里的value与roleId进行了绑定
                        onChange={(value, index) => {
                            // console.log('roleId',index);// index可以获取每次点击时的数据
                            if (value === '超级管理员') {
                                setIsDisable(true);
                                // 清空表单框的内容
                                ref.current.setFieldsValue({
                                    region: ''
                                })
                            } else setIsDisable(false)
                            return index
                        }}
                    />
                </Form.Item>
            </Form>
        </div>
    )
})
export default UserForm