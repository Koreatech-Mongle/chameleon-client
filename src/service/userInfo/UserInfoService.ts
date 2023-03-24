import {useEffect, useState} from "react";
import instance from "../../ConstantValue";

export default function useGetUserInfo(userId: any) {
  const [user, setUser] = useState<any>();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = "1234";

  useEffect(() => {
    let completed = false;

    (async function get() {
      try {
        const response = await instance.get(`/auth/info`, {
          timeout: 5000,
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authentication': `${token}`,
          }
        });

        if (!completed) {
          setLoading(false);
          setUser(response.data);
        }
      } catch (error) {
        console.error(error);
        setError(true);
        setLoading(false);
      }
    })();

    return () => {
      completed = true;
    };
  }, []);

  if (loading) {
    return {userName: "불러오는 중...", userEmail: "불러오는 중..."};
  } else if (error) {
    return {userName: "사용자 이름", userEmail: "사용자 이메일"};
  } else {
    return {userName: user?.name, userEmail: user?.email};
  }
}