//import { useState } from "react";
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "~/routes";
import { DefaultLayout } from "~/component/Layouts";

function App() {


  const dispatch      = useDispatch();
  const { unique_string, isSigned, credential, proxy } = useSelector( state => state );
  
  const _token = localStorage.getItem("_token");
  const credential_string = localStorage.getItem("credential_string");

  useEffect(() => {
      fetch('/api/get/the/god/damn/api/key/with/ridiculous/long/url/string', {
          headers: {
              "Authorization": _token,
          },
      })
      .then( res => res.json() )
      .then( ({ unique_string }) => {
          dispatch({
              type: "setUniqueString",
              payload: { unique_string }
          })
          const creadential_string_request_url = `${ proxy }/api/${ unique_string }/user/getall/${ credential_string }`
          fetch(creadential_string_request_url, {
              headers: {
                  "Authorization": _token,
              },
          }).then( res => res.json() ).then((data) => {
              
          })
      })

  }, [])
  
    return (
        <Router>
            <div className="App">
                <Routes>
                  {publicRoutes.map((route, index) => {
                    //console.log(route)
                    const Page = route.component;
                    
                     let Layout = DefaultLayout;

                     if(route.layout){
                      Layout = route.layout
                     }
                     else if( route.layout === null ){
                      Layout = Fragment
                     }

                    return (
                      <Route
                        key={index}
                        path={route.path}
                        element={
                          <Layout>
                            <Page />
                          </Layout>
                        }
                      />
                    );
                  })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
