import { BASE_URL } from "../../api/client";

const baseUrl = (path: string): string => BASE_URL + path;

export default baseUrl;
