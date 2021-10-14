import React, { useState } from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import i18next from 'i18next';

import { sleep } from '@utils';
import { f7, List, ListInput, Navbar, Page } from 'framework7-react';
import { EditItemInfoProps } from '@constants';
import { editItem, uploadImages } from '@api';
import { useRecoilValue } from 'recoil';
import {
  itemCategoryNameAtom,
  itemImgFilesAtom,
  itemNameAtom,
  itemPriceAtom,
  itemStockAtom,
} from '@atoms';
import { InfoItem } from '@interfaces/item.interface';
import { mapValues } from 'lodash';

const EditItemInfoSchema = Yup.object().shape({
  infos: Yup.lazy((obj) =>
    Yup.array()
      .of(
        Yup.object(
          mapValues(obj, () =>
            Yup.object({
              key: Yup.string(),
              value: Yup.string(),
            }),
          ),
        ),
      )
      .optional(),
  ),
});

interface IInfoArray {
  id: number;
  key: string;
  value: string;
}

const EditItemInfoPage = ({ f7router, itemId, itemInfos, currentImageUrls }: EditItemInfoProps) => {
  const [infos, setInfosNumber] = useState<IInfoArray[]>([...itemInfos]);
  const itemName = useRecoilValue(itemNameAtom);
  const itemPrice = useRecoilValue(itemPriceAtom);
  const itemCategoryName = useRecoilValue(itemCategoryNameAtom);
  const itemStock = useRecoilValue(itemStockAtom);
  const itemImgFiles = useRecoilValue(itemImgFilesAtom);

  const [infoKeys, setInfoKeys] = useState<string[]>(itemInfos.map((info) => info.key));
  const [infoValues, setInfoValues] = useState<string[]>(itemInfos.map((info) => info.value));

  const initialValues = {};

  const handleEditItem = async (values, setSubmitting) => {
    await sleep(400);
    setSubmitting(false);
    f7.dialog.preloader('잠시만 기다려주세요...');
    try {
      const { ...rest } = values;

      const submittedInfoObjects: InfoItem[] = infos.map<InfoItem>((info) => ({
        id: info.id,
        key: rest[`${info.id}-infoKey`] as string,
        value: rest[`${info.id}-infoValue`] as string,
      }));

      let images: string[];
      if (itemImgFiles.length !== 0) {
        const formBody = new FormData();

        for (const image of itemImgFiles) {
          formBody.append('files', image);
        }
        const {
          status,
          data: { urls },
        } = await uploadImages(formBody);
        if (status === 200) {
          images = urls;
        }
      } else {
        images = currentImageUrls;
      }

      try {
        const { ok, error } = await editItem({
          name: itemName,
          price: itemPrice,
          categoryName: itemCategoryName,
          stock: itemStock,
          images,
          infos: submittedInfoObjects,
          itemId,
        });

        if (ok) {
          f7.dialog.alert('상품을 성공적으로 수정했습니다.');
          f7router.navigate(`/items/${itemId}`);
        } else {
          f7.dialog.alert(error);
        }
        f7.dialog.close();
      } catch (error) {
        f7.dialog.close();
        f7.dialog.alert(error?.response?.data || error?.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onChangeInfoKey = (e: any, index: number) => {
    const {
      target: { value },
    } = e;
    infoKeys[index] = value;
    setInfoKeys(infoKeys.map((infoKey) => infoKey));
  };

  const onChangeInfoValue = (e: any, index: number) => {
    const {
      target: { value },
    } = e;
    infoValues[index] = value;
    setInfoValues(infoValues.map((infoKey) => infoKey));
  };

  const AddInfoBtn = () => {
    setInfosNumber((infos) => [
      ...infos,
      {
        id: Date.now(),
        key: '',
        value: '',
      },
    ]);
  };

  return (
    <Page>
      <Navbar title="상품 수정" backLink sliding={false} />
      <div className="p-4 mx-2 bg-gray-200">
        <div className="flex justify-between border-black border-t pt-4">
          <div className="p-3 font-semibold text-center">상품 정보</div>
          <div className="w-32 flex items-center">
            <button onClick={AddInfoBtn} className="p-2 rounded-lg text-white bg-blue-400">
              상품 정보 추가
            </button>
          </div>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={EditItemInfoSchema}
          onSubmit={(values, { setSubmitting }) => handleEditItem(values, setSubmitting)}
          validateOnMount
        >
          {({ handleBlur, isSubmitting, isValid, setFieldValue }) => (
            <Form>
              <List noHairlinesMd>
                <div className="p-3 flex flex-col mb-10">
                  {infos.length !== 0 &&
                    infos.map((info, index) => (
                      <ul key={info.id} className="flex border border-gray-2">
                        <ListInput
                          label={i18next.t('item.infoKey') as string}
                          type="text"
                          value={infoKeys[index]}
                          name={`${info.id}-infoKey`}
                          placeholder="상품 정보의 이름을 입력해주세요"
                          clearButton
                          onChange={(e) => {
                            setFieldValue(`${info.id}-infoKey`, e.target.value);
                            onChangeInfoKey(e, index);
                          }}
                          onBlur={handleBlur}
                        />
                        <ListInput
                          label={i18next.t('item.infoValue') as string}
                          type="text"
                          value={infoValues[index]}
                          name={`${info.id}-infoValue`}
                          placeholder="상품 정보 내용을 입력해주세요"
                          clearButton
                          onChange={(e) => {
                            setFieldValue(`${info.id}-infoValue`, e.target.value);
                            onChangeInfoValue(e, index);
                          }}
                          onBlur={handleBlur}
                        />
                      </ul>
                    ))}
                </div>
              </List>

              <div className="p-4">
                <button
                  type="submit"
                  className="button button-fill button-large disabled:opacity-50"
                  disabled={isSubmitting || !isValid}
                >
                  상품 수정
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Page>
  );
};

export default React.memo(EditItemInfoPage);
