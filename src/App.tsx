import React, { useState, useMemo} from 'react';

import Input from 'antd/lib/input';
import Table from 'antd/lib/table';
import Col from 'antd/lib/grid/col';
import Row from 'antd/lib/grid/row';

import './App.css';

interface Link {
  link: string,
  description: string,
  title: string
}

export default () => {
  const [data, set_data] = useState([]);
  const [filtered_data, set_filtered_data] = useState([]);
  const [search_query, set_search_query] = useState("");

  const handle_search = (new_search_query: string) => {
    set_search_query(new_search_query);

    const new_data = data.filter((item: Link) => {
      if (new_search_query === '') {
        return item;
      } else {
        return item.description.toLowerCase().includes(new_search_query.toLowerCase())
      }
    })
    set_filtered_data(new_data);
  };
  
  useMemo(() => {
    fetch('https://api.poplava.info/all')
      .then(res => res.json())
      .then(body => {
        set_data(body);
        set_filtered_data(body);
      })
      .catch(() => {
        console.log('sadness');
    });
  }, []);

  const suffix = <span>Знайдено {filtered_data.length} фрагментів</span>;
  const input = <Input placeholder="Пошук" onChange={(e) => handle_search(e.target.value)} suffix={suffix}/>
  const columns = [
    {
      title: 'Опис',
      dataIndex: 'description',
      key: 'link',
      width: 800,
      render: (text: string, record: Link) => {
          return <a href={record.link}>{text}</a>
      }
    },
    {
      title: 'Відео',
      key: 'link',
      dataIndex: 'title',
      width: 800,
    }
  ];

  return <>
      <Row style={{ marginBottom: 20 }}></Row>
      <Row align='middle'>

          <Col>
            {input}
          </Col>

      </Row>
      <Row style={{ marginBottom: 20}}></Row>
      <Row >
        <Col>
          <Table
              dataSource={filtered_data}
              columns={columns}
              size="large"
          />
          </Col>

      </Row>
  </>
};