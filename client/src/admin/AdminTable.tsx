import { Button } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { Table } from '../table/Table';
import CopyIcon from './copy.png';
import DownloadIcon from './download.png';
import { agent } from './context';
import { Column } from './types';

export function AdminTable({ id, columns }: { id: string, columns: Column<any>[] }) {
  const navigate = useNavigate();

  return (columns ? (
    <Table
      columns={columns.map((column: any) => ({
        key: column.key as any,
        title: column.title,
        type: ['anchor', 'password'].includes(column.type) ? 'str' : column.type as any,
        values: column.values,
        render(row: any) {
          if (!row[column.key]) {
            return null;
          }

          if (column.type === 'date') {
            return moment(row[column.key]).format(column.format)
          }

          if (column.type === 'anchor') {
            const { href, label } = row[column.key];

            if (href.startsWith('http')) {
              return <a href={href} target="_blank">{label}</a>
            } else {
              return (
                <a
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(href);
                  }}
                >
                  {label}
                </a>
              );
            }
          }

          if (column.type === 'img') {
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={row[column.key]} alt={column.key} style={{ height: 50, width: 'auto' }} />
                <a href={row[column.key]} target="_blank">
                  <Button size="small">
                    <img src={DownloadIcon} className="icon" />
                  </Button>
                </a>
              </div>
            )
          }

          if (column.type === 'key') {
            return (
              <div>
                <Button style={{ marginRight: 10 }} size="small" onClick={() => navigator.clipboard.writeText(row[column.key])}>
                  <img src={CopyIcon} className="icon" />
                </Button>
                {row[column.key].slice(0, 5)}
                ...
              </div>
            )
          }

          return row[column.key];
        }
      }))}
      getData={(params) => {
        return agent.post(`/admin/pages/get-data`, { params, tableId: id }).then(res => res.data);
      }} 
    />
  ) : <>Загрузка...</>)
}
