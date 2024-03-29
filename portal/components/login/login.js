import React, { useEffect, useState } from "react";

import controls from "./form.config";
import { signIn } from "next-auth/client";
import styles from "../../styles/Login.module.css";
import { useRouter } from "next/router";
import { useToasts } from "react-toast-notifications";
import PropTypes from "prop-types";

const Login = (props) => {
  const { persona } = props;
  const [input, setInput] = useState({});
  const router = useRouter();
  const [inputValidity, setInputValidity] = useState(
    controls.map((control) => {
      return {
        [control.name]: false,
      };
    })
  );
  const [formValidity, setFormValidity] = useState(false);

  const handleInput = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    setInputValidity({
      ...inputValidity,
      [e.target.name]: e.target.validity.valid,
    });
  };

  useEffect(() => {
    let validity = controls.reduce(
      (acc, control) => (acc = acc && inputValidity[control.name]),
      true
    );
    setFormValidity(validity);
  }, [inputValidity]);

  const { addToast } = useToasts();

  const signUserIn = async (e) => {
    // if (session.role === "Recruiter") {
    //   persona.redirectUrl = `admin#/vacancy_details`;
    // }
    console.log({ persona });
    e.preventDefault();
    const { error, url } = await signIn("fusionauth", {
      loginId: input.username,
      password: input.password,
      applicationId: persona.applicationId,
      redirect: false,
      callbackUrl: `${
        persona.redirectUrl.search("http") < 0
          ? `${process.env.NEXT_PUBLIC_URL}/${persona.redirectUrl}`
          : persona.redirectUrl
      }`,
    });
    if (url) {
      router.push(url);
    }
    if (error) {
      addToast(error, { appearance: "error" });
    }
  };

  return (
    <div className={`${styles.grid} ${styles["grid-one"]}`}>
      <span className={styles.description}>
        Log in as <span className={"text-bold"}>{persona.en}</span>&#47; <br />
        <span className={"text-bold"}>{persona.hi}</span> लॉग इन
      </span>
      <span className={styles.helper}>
        <span className={"text-bold"}>{persona.credentials}</span> के यूज़र
        नाम/पासवर्ड से लॉग इन कीजिए
      </span>
      <form className={styles.form}>
        {controls.map((control) => (
          <input
            key={control.name}
            type={control.type}
            name={control.name}
            autoComplete={control.autocomplete}
            required={control.required}
            placeholder={control.placeholder}
            pattern={control.pattern}
            onChange={handleInput}
          />
        ))}
        <button
          autoComplete="off"
          disabled={!formValidity}
          onClick={signUserIn}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

Login.propTypes = {
  persona: PropTypes.shape({
    consonant: PropTypes.bool,
    en: PropTypes.string,
    hi: PropTypes.string,
    credentials: PropTypes.string,
    applicationId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    redirectUrl: PropTypes.string,
  }).isRequired,
};

export default Login;
