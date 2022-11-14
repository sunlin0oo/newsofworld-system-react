import React, { useEffect, useState, useContext, useRef } from 'react'
import { Table, Button, Modal,Form, Input,} from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
const { confirm } = Modal;
export default function NewsCategory() {
  const [dataSource, setDataSource] = useState([]);
  const EditableContext = React.createContext(null)
  useEffect(() => {
    axios.get('/categories').then(res => {
      console.log('NewsCategory-res.data', res.data);
      const list = res.data;
      setDataSource(list);
    })
  }, [])

  const handleSave = (record) =>{
    console.log(record);
    setDataSource(dataSource.map(item=>{
      // 如果更新的ID 与 遍历的ID一致，则返回新设置的,否则是原先的
      if(item.id === record.id){
        return {
          id:item.id,
          title:record.title,
          value:record.title
        }
      }
      return item
    }))
    axios.patch(`/categories/${record.id}`,{
      title:record.title,
      value:record.title
    })
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '栏目名称',
      dataIndex: 'title',
      key: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '栏目名称',
        handleSave,
      }),
    },
    {
      title: '操作',
      // 什么都不写的话会直接获取到这一项
      render: (item) => {
        return <div>
          <Button danger shape="circle" size={'large'} icon={<DeleteOutlined />} onClick={() => delConfirm(item)} />
        </div>
      }
    },
  ];

  // 确认删除框==>对话框
  const delConfirm = (item) => {
    confirm({
      title: 'Do you Want to delete these items?',
      icon: <ExclamationCircleOutlined />,
      content: 'Some descriptions',
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const deleteMethod = (item) => {
      setDataSource(dataSource.filter(data => data.id !== item.id));// 过滤出与删除的id不相同的数据
      // 在处理后端
      axios.delete(`/categories/${item.id}`)
  }

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({
          ...record,
          ...values,
        });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
    let childNode = children;
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    return <td {...restProps}>{childNode}</td>;
  };

  return (
    <div>
      {/* 为什么这里不用加rowkey是因为，后端传来的字段，存在key字段，故自动填充上 */}
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 4
        }}
        rowKey={item => item.id}
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }} />
    </div>
  )
}
