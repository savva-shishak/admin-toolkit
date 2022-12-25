import React, { useEffect, useState, ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { Column } from './types';
import { AdminTable } from './AdminTable';
import LoadingPng from '../table/loading.gif';
import { agent } from './context';

type HtmlComponent = {
  type: 'html',
  payload: string,
};

type TableComponent = {
  type: 'table',
  columns: Column<any>[],
  tableId: string,
};

type PageComponent = HtmlComponent | TableComponent;

export function AdminPage({ path }: { path: string }) {
  const [components, setComponents] = useState<ReactNode[]>([]);
  const [loading, setLoading] = useState(true);

  const params = useParams();

  useEffect(() => {
    setLoading(true);
    agent.post('/admin/pages/load', { path, params }).then(({ data: { content, title } }) => {
      document.title = title;
      setComponents(
        content.map((item: PageComponent, id: number) => {
          if (item.type === 'html') {
            return <div dangerouslySetInnerHTML={{ __html: item.payload }} />;
          }

          if (item.type === 'table') {
            return <AdminTable columns={item.columns} id={item.tableId} />;
          }

          return <React.Fragment key={id}/>;
        })
      );
      setLoading(false);
    });
  }, [path]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      overflow: 'auto',
      display: 'grid',
      gridTemplateColumns: '1fr',
      gridAutoRows: 'max-content',
      padding: 20
    }}>
      {loading
        ? (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <img style={{ width: 500 }} src={LoadingPng} alt="loading" />
          </div>
        )
        : components
      }
    </div>
  )
}