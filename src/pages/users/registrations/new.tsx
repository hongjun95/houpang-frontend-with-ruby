import React from 'react';
import * as Yup from 'yup';
import { Form, Formik, FormikHelpers } from 'formik';
import { f7, List, ListInput, Navbar, Page } from 'framework7-react';

import i18next from 'i18next';
import { SignUpForm } from '@interfaces/user.interface';
import { signupAPI } from '@api';
import useAuth from '@hooks/useAuth';

const SignUpPage = () => {
  const { authenticateUser } = useAuth();

  const SignUpSchema: Yup.SchemaOf<SignUpForm> = Yup.object().shape({
    name: Yup.string() //
      .required('필수 입력사항 입니다'),
    email: Yup.string() //
      .email('이메일을 입력하세요')
      .required('필수 입력사항 입니다'),
    password: Yup.string()
      .min(8, '길이가 너무 짧습니다')
      .max(50, '길이가 너무 깁니다')
      .matches(/(?=.*[!@#$%^&\*\(\)_\+\-=\[\]\{\};\':\"\\\|,\.<>\/\?]+)(?=.*[a-zA-Z]+)(?=.*\d+)/, {
        message: '비밀번호는 문자, 숫자, 특수문자를 1개 이상 포함해야 합니다.',
      })
      .required('필수 입력사항 입니다'),
    password_confirmation: Yup.string()
      .min(8, '길이가 너무 짧습니다')
      .max(50, '길이가 너무 깁니다')
      .required('필수 입력사항 입니다'),
    address1: Yup.string() //
      .required('필수 입력사항 입니다'),
    phone: Yup.string()
      .matches(/^[0-9]{3}[-]+[0-9]{4}[-]+[0-9]{4}$/, {
        message: "'-'를 포함한 전하번호 11자리를 입력하세요.",
      })
      .required('필수 입력사항 입니다'),
    images: Yup.array(),
  });

  const initialValues: SignUpForm = {
    email: '',
    name: '',
    password: '',
    password_confirmation: '',
    phone: '',
    address1: '',
  };

  const handleSignUp = async (values, setSubmitting) => {
    setSubmitting(false);
    f7.dialog.preloader('잠시만 기다려주세요...');
    try {
      try {
        const user = await signupAPI({ ...values });
        f7.dialog.close();
        authenticateUser(user);
      } catch (error) {
        f7.dialog.close();
        f7.dialog.alert(error?.response?.data || error?.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Page>
      <Navbar title="회원가입" backLink sliding={false} />
      <p className="font-semibole text-4xl text-center mt-5">Houpang</p>
      <Formik
        initialValues={initialValues}
        validationSchema={SignUpSchema}
        onSubmit={(values, { setSubmitting }: FormikHelpers<SignUpForm>) => handleSignUp(values, setSubmitting)}
        validateOnMount
      >
        {({ handleChange, handleBlur, values, errors, touched, isSubmitting, isValid }) => (
          <Form>
            <List noHairlinesMd>
              <div className="p-3 font-semibold bg-white">기본 정보</div>
              <ListInput
                label={i18next.t('login.name') as string}
                type="text"
                name="name"
                placeholder="이름을 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                errorMessageForce
                errorMessage={touched.name && errors.name}
              />
              <ListInput
                label={i18next.t('login.email') as string}
                type="email"
                name="email"
                placeholder="이메일을 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                errorMessageForce
                errorMessage={touched.email && errors.email}
              />
              <ListInput
                label={i18next.t('login.password') as string}
                type="password"
                name="password"
                placeholder="비밀번호를 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                errorMessageForce
                errorMessage={touched.password && errors.password}
              />
              <ListInput
                label={i18next.t('login.password_confirmation') as string}
                type="password"
                name="password_confirmation"
                placeholder="비밀번호를 확인해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password_confirmation}
                errorMessageForce
                errorMessage={touched.password_confirmation && errors.password_confirmation}
              />
            </List>
            <List noHairlinesMd>
              <div className="p-3 font-semibold bg-white">세부 정보</div>
              <ListInput
                label={i18next.t('login.phone') as string}
                type="text"
                name="phone"
                placeholder="전화번호를 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.phone}
                errorMessageForce
                errorMessage={touched.phone && errors.phone}
              />
              <ListInput
                label={i18next.t('login.address1') as string}
                type="text"
                name="address1"
                placeholder="주소를 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.address1}
                errorMessageForce
                errorMessage={touched.address1 && errors.address1}
              />
            </List>

            <div className="p-4">
              <button
                type="submit"
                className="button button-fill button-large disabled:opacity-50"
                disabled={isSubmitting || !isValid}
              >
                회원가입
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Page>
  );
};

export default React.memo(SignUpPage);
