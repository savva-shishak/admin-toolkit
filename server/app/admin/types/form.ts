import { v4 } from "uuid";
import { admin } from "..";

export type FormType = {
  width?: string,
  title: string,
  img?: string,
  inputs: string[];
  actions: {
    text: string,
    type?: 'primary' | 'warning' | 'danger' | 'success' | 'secondary' | 'info' | 'light' | 'dark' | 'link'
    action: (data: any) => any,
  }[];
}

export function renderForm({ title, inputs, actions, width = '100%', img }: FormType) {
  return (`
    <form
      class="card"
      style="width: ${width}"
      enctype="multipart/form-data"
    >
      <div class="card-header">
        ${title}
      </div>
      <div class="card-body" style="display: grid; grid-template-columns: ${img ? '250px 1fr' : '1fr'}">
        ${img ? `<img src="${img}" style="width: 100%; height: auto; object-fit: contain; object-position: center">` : ''}
        <div class="row" style="height: min-content">
          ${inputs.map((input) => `<div class="col-4">${input}</div>`).join('')}
        </div>
      </div>
      <div class="card-footer" style="display: flex; justify-content: flex-end; align-items: center; gap: 10px">
        ${actions.map(({ action, text, type = 'primary' }) => {
          const id = v4();

          admin.compoents.push({ id, type: 'action', action });

          return `
            <button
              formaction="/admin/pages/components/action/${id}"
              formmethod="POST"
              class="btn btn-${type}"
            >
              ${text}
            </button>
          `;
        })}
      </div>
    </form>
  `);
}

export function input({
  label,
  name,
  value,
  type = "text",
  required = false
}: {
  label: string,
  name: string,
  value: string | number,
  type?: string,
  required?: boolean,
}) {
  const id = v4();
  return (`
    <div class="mb-3">
      <label for="${id}" class="form-label">${label}</label>
      <input
        type="${type}"
        class="form-control"
        id="${id}"
        value="${value}"
        name="${name}"
        ${required ? 'required' : ''}
      >
    </div>
  `);
}