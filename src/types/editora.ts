export interface Editora {
  id: string;
  nome: string;
  urlLogotipo: string;
}

export interface EditoraRequest {
  nome: string;
  urlLogotipo: string;
}

export interface ErrorResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  additionalProp1: string;
  additionalProp2: string;
  additionalProp3: string;
}