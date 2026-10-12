import { useEffect } from "react";
// import Swal from "sweetalert2";
// import useAuth from "./useAuth";
import { axiosPrivate } from "../Axios";


const useAxiosPrivate = () => {
    // const { auth, setAuth } = useAuth();



    useEffect(() => {
        axiosPrivate.interceptors.request.use(
            config => {
                if (config.data instanceof FormData) {
                    config.headers["Content-Type"] = "multipart/form-data";
                  } else {
                    config.headers["Content-Type"] = "application/json";
                  }

                if (!config.headers['Authorization']) {
                    // config.headers['Authorization'] = `Token ${auth?.accessToken}`;
                    // config.headers['Authorization'] = auth?.accessToken;
                    config.headers['Authorization'] = localStorage.getItem("Token");
                }



                return config;
            },
            error => {
                return Promise.reject(error)
            }
        );

        axiosPrivate.interceptors.response.use(
            response => {
                return response
            },
           async error => {
 

                return Promise.reject(error)
            }
        );
    // }, [auth])
    }, [])

    return axiosPrivate
}

export default useAxiosPrivate;