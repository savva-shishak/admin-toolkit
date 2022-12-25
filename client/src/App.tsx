import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Login } from './login/Login';
import { useEffect, useRef, useState } from 'react';
import { agent } from './admin/context';
import { AdminPage } from './admin/AdminPage';
import LoadingPng from './table/loading.gif';
import OperatorIcon from './assets/operator.png'

function App() {
  const location = useLocation();
  const [paths, setPaths] = useState<string[]>([]);
  const [menu, setMenu] = useState<{ path: string, title: string, icon: string }[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!location.pathname.startsWith('/login') && !loadedRef.current) {
      loadedRef.current = true;
      setLoading(true)
      agent.get('/admin/pages/').then(({ data: { paths, menu } }) => {
        setPaths(paths);
        setMenu(menu);
        setLoading(false);
      });
    }
  }, [location.pathname]);

  return (
    <div
      onSubmit={(e) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;

        const { method = 'get', attributes: { action: { value: url } = { value: location.pathname } } } = form as any;

        agent({ method, url, data: new FormData(form) }).then(({ data }) => {
          if (typeof data === 'string') {
            navigate(data)
          }
        })
      }}
      onClick={(e) => {
        const getAnchor = (element: HTMLElement): HTMLAnchorElement | false => {
          if (element instanceof HTMLAnchorElement) {
            return element;
          }

          if (element.parentElement) {
            return getAnchor(element.parentElement);
          }

          return false
        }

        if (e.target instanceof HTMLElement) {
          const anchor = getAnchor(e.target);

          console.log(anchor);

          if (anchor && (anchor.attributes as any)?.href?.value) {
            e.preventDefault();
            navigate((anchor.attributes as any)?.href?.value || '/');
          }
        }
      }}
      style={{
        width: '100vw',
        height: '100vh',
        display: 'grid',
        gridTemplateColumns:'200px 1fr',
        gridTemplateRows: '100%',
        overflow: 'hidden',
      }}
    >
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            loading
            ? (
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  gridColumn: '1/3',
                }}
              >
                <img style={{ height: 400, width: 'auto' }} src={LoadingPng} alt="loading" />
              </div>
            ) : (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  flexFlow: 'column nowrap',
                  borderRight: '1px solid grey',
                }}
              >
                <img style={{ width: 150, height: 150, marginBottom: 50 }} src={OperatorIcon} alt="logo" />
                {menu.map(({ path, title, icon }) => (
                  <a
                    key={path}
                    href={path}
                    style={{
                      gap: 10,
                      width: '180px',
                      display: 'flex',
                      alignItems: 'center',
                      textDecoration: 'underline',
                      textDecorationColor: 'blue',
                      color: 'black'
                    }}
                  >
                    <img src={icon} className="icon" />
                    {title}
                  </a>
                ))}
              </div>
              <Routes>
                {paths.map((path) => <Route key={path} path={path} element={<AdminPage path={path} />} />)}
              </Routes>
            </>
          )}
        />
      </Routes>
    </div>
  )
}

export default App
