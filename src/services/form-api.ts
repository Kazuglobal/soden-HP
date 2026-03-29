export type FormResponse = {
  success: boolean;
  message?: string;
  errors?: string[];
};

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  fax?: string;
};

export type EntryPayload = {
  name: string;
  furigana: string;
  email: string;
  phone: string;
  age: number | string;
  education?: string;
  workHistory?: string;
  qualifications?: string;
  startDate?: string;
  motivation: string;
  fax?: string;
};

const FORM_API_BASE = '/api/forms';

async function submitForm(endpoint: string, payload: Record<string, unknown>): Promise<FormResponse> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  let data: FormResponse | null = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok || !data?.success) {
    const fallbackMessage = response.status === 400
      ? '入力内容をご確認ください。'
      : '送信に失敗しました。';
    throw new Error(data?.message ?? fallbackMessage);
  }

  return data;
}

export function submitContact(payload: ContactPayload): Promise<FormResponse> {
  return submitForm(`${FORM_API_BASE}/contact`, payload as Record<string, unknown>);
}

export function submitEntry(payload: EntryPayload): Promise<FormResponse> {
  return submitForm(`${FORM_API_BASE}/entry`, payload as Record<string, unknown>);
}
