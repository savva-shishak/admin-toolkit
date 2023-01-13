import { v4 } from "uuid";
import { admin } from "..";
import { User } from "../Users";

export type FormType = {
  width?: string,
  title: string,
  img?: string,
  columns?: number,
  inputs: string[];
  actions: {
    text: string,
    type?: 'primary' | 'warning' | 'danger' | 'success' | 'secondary' | 'info' | 'light' | 'dark' | 'link'
    action: (data: any) => any,
  }[];
}

export function renderForm({ title, inputs, actions, width = '100%', img, columns = 4 }: FormType, user: User) {
  return (`
    <form
      class="card"
      style="width: ${width}"
      enctype="multipart/form-data"
    >
      <div class="card-header">
        ${title}
      </div>
      <div class="card-body" style="display: grid; grid-template-columns: ${img ? '250px 1fr' : '1fr'}; gap: 50px">
        ${img ? `<img src="${img}" style="width: 100%; height: auto; object-fit: contain; object-position: center">` : ''}
        <div style="height: min-content; display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 10px">
          ${inputs.join('')}
        </div>
      </div>
      <div class="card-footer" style="display: flex; justify-content: flex-end; align-items: center; gap: 10px">
        ${actions.map(({ action, text, type = 'primary' }) => {
          const id = v4();

          admin.compoents.push({ id, type: 'action', action, userId: user.id });

          return `
            <button
              formaction="/admin/pages/components/action/${id}"
              formmethod="POST"
              class="btn btn-${type}"
            >
              ${text}
            </button>
          `;
        }).join('')}
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

export function checkbox({
  label,
  name,
  value,
  required = false
}: {
  label: string,
  name: string,
  value: boolean,
  required?: boolean,
}) {
  const id = v4();
  return (`
    <div class="mb-3">
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          id="${id}"
          name="${name}"
          ${required ? 'required' : ''}
          ${value ? 'checked' : ''}
        >
        <label class="form-check-label" for="${id}">
        ${label}
        </label>
      </div>
    </div>
  `);
}

export function select({
  label,
  name,
  value,
  options,
  required = false
}: {
  label: string,
  name: string,
  value: string | number,
  options: ({ value: string, text: string } | string)[],
  required?: boolean,
}) {
  const id = v4();
  return (`
    <div class="mb-3">
      <label for="${id}" class="form-label">${label}</label>
      <select
        name="${name}"
        id="${id}"
        class="form-select"
        ${required ? 'required' : ''}
      >
        ${options
          .map((option) => typeof option === 'string' ? { value: option, text: option } : option)
          .map((option) => (
            `<option
              value="${option.value}"
              ${value === option.value ? 'selected' : ''}
            >
              ${option.text}
            </option>`
          ))
          .join('')
        }
      </select>
    </div>
  `);
}

export function multiselect({
  label,
  name,
  value,
  options,
  required = false
}: {
  label: string,
  name: string,
  value: (string | number)[],
  options: ({ value: string, text: string } | string)[],
  required?: boolean,
}) {
  const id = v4();
  return (`
    <div class="mb-3">
      <label for="${id}" class="form-label">${label}</label>
      <ul class="list-group">
        ${options
          .map((option) => typeof option === 'string' ? { value: option, text: option } : option)
          .map((option) => (`
            <li class="list-group-item">
              <input
                id="${id}"
                class="form-check-input"
                type="checkbox"
                value="${option.value}"
                ${value.includes(option.value) ? 'checked' : ''}
                ${required ? 'required' : ''}
                name="${name}[]"
              >
              <label class="form-check-label" for="${id}">
                ${option.text}
              </label>
            </li>
          `))
          .join('')
        }
      </ul>
    </div>
  `);
}