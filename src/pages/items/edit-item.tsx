import React, { useState } from 'react';
import i18next from 'i18next';
import * as Yup from 'yup';
import { Form, Formik, FormikHelpers } from 'formik';
import { useSetRecoilState } from 'recoil';
import { useQuery, useQueryClient } from 'react-query';
import { List, ListInput, ListItem, Navbar, Page } from 'framework7-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

import { getCategories } from '@api';
import { EditItemForm, FindItemByIdOutput } from '@interfaces/item.interface';
import { GetAllCategoriesOutput } from '@interfaces/category.interface';
import { itemCategoryNameAtom, itemImgFilesAtom, itemNameAtom, itemPriceAtom, itemStockAtom } from '@atoms';
import { itemKeys } from '@reactQuery/query-keys';
import PreviewImg from '@components/PreviewImg';

const EditItemInfoPage = ({ f7router, f7route }) => {
  const setItemhName = useSetRecoilState(itemNameAtom);
  const setItemPrice = useSetRecoilState(itemPriceAtom);
  const setItemCategoryName = useSetRecoilState(itemCategoryNameAtom);
  const setStockAtom = useSetRecoilState(itemStockAtom);
  const setItemImgFile = useSetRecoilState(itemImgFilesAtom);
  const [previewImgUris, setPreviewImgUris] = useState<(string | ArrayBuffer)[]>([]);

  const queryClient = useQueryClient();
  const itemId = f7route.params.id;
  const itemData = queryClient.getQueryData<FindItemByIdOutput>(itemKeys.detail(itemId));
  const { is_main }: { is_main: boolean } = f7route.query;

  const EditItemSchema: Yup.SchemaOf<EditItemForm> = Yup.object().shape({
    name: Yup.string() //
      .required('필수 입력사항 입니다'),
    price: Yup.number() //
      .min(0)
      .required('필수 입력사항 입니다'),
    category_name: Yup.string() //
      .required('필수 입력사항 입니다'),
    stock: Yup.number() //
      .min(0)
      .required('필수 입력사항 입니다'),
    images: Yup.array(),
  });

  const initialValues: EditItemForm = {
    name: itemData.item.name,
    price: itemData.item.sale_price,
    category_name: itemData.item.category.title,
    stock: itemData.item.stock,
    images: [],
  };

  const { data: categoryData, status } = useQuery<GetAllCategoriesOutput, Error>(['categories_key'], getCategories);

  const handleItemContent = async (values: EditItemForm, setSubmitting) => {
    setSubmitting(false);

    try {
      const { name, price, category_name, stock, images } = values;

      if (images.length !== 0) {
        setItemImgFile(images);
      }
      setItemhName(name);
      setItemPrice(price);
      setItemCategoryName(category_name);
      setStockAtom(stock);
      f7router.navigate(`/items/${itemId}/edit-info`, {
        props: {
          itemId,
          itemInfos: itemData.item.infos || [],
          currentImageUrls: itemData.item.product_images,
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handlePreviewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;

    if (files) {
      const fileArr = Array.from(files);
      fileArr.forEach((file) => {
        let reader = new FileReader();
        reader.onload = (ev) => {
          setPreviewImgUris((prev) => [...prev, ev.target.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <Page noToolbar={!is_main}>
      <Navbar title="상품 수정" backLink={!is_main} sliding={false} />
      <p className="font-semibole text-4xl text-center mt-5">Houpang</p>
      <Formik
        initialValues={initialValues}
        validationSchema={EditItemSchema}
        onSubmit={(values, { setSubmitting }: FormikHelpers<EditItemForm>) => handleItemContent(values, setSubmitting)}
        validateOnMount
      >
        {({ handleChange, handleBlur, setFieldValue, values, errors, touched, isSubmitting, isValid }) => (
          <Form>
            <List noHairlinesMd>
              <div className="p-3 font-semibold bg-white">상품 정보</div>
              <ListInput
                label={i18next.t('item.name') as string}
                type="text"
                name="name"
                placeholder="상품 이름을 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                errorMessageForce
                errorMessage={touched.name && errors.name}
              />
              <ListInput
                label={i18next.t('item.price') as string}
                type="number"
                name="price"
                placeholder="가격을 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.price}
                errorMessageForce
                errorMessage={touched.price && errors.price}
              />
              <ListInput
                label={i18next.t('item.stock') as string}
                type="number"
                name="stock"
                placeholder="재고를 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.stock}
                errorMessageForce
                errorMessage={touched.stock && errors.stock}
              />
              {status === 'success' && (
                <ListItem title="카테고리" smartSelect>
                  <select name="category_name" defaultValue={`${categoryData.categories[0].title}`}>
                    {categoryData.categories.map((category) => (
                      <option key={category.id} value={`${category.title}`}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </ListItem>
              )}
              <div className="flex justify-center py-2 border-b border-gray-400 relative">
                <label //
                  htmlFor="upload-images"
                  className="text-blue-500 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faCamera} />
                  첨부하기
                </label>
                <input //
                  type="file"
                  name="images"
                  id="upload-images"
                  className="opacity-0 absolute z-0"
                  accept="image/*"
                  multiple
                  onChange={(event) => {
                    const images = event.target.files;
                    const myFiles = Array.from(images);
                    handlePreviewImage(event);
                    setFieldValue('images', myFiles);
                  }}
                />
              </div>
              <div className="grid grid-cols-5 grid-flow-row mt-3 gap-3 mx-4">
                {previewImgUris &&
                  previewImgUris.map((previewImgUri) => (
                    <PreviewImg //
                      previewImgUri={previewImgUri}
                      className="object-cover object-center h-20 w-24 rounded-sm"
                    />
                  ))}
              </div>
            </List>
            <div className="p-4">
              <button
                type="submit"
                className="button button-fill button-large disabled:opacity-50"
                disabled={isSubmitting || !isValid}
              >
                다음
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Page>
  );
};

export default React.memo(EditItemInfoPage);
