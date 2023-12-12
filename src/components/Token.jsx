import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

const useToken = async () => {
  const { getToken } = useKindeAuth();

  const token = await getToken();
  return token;
};

export default useToken;
