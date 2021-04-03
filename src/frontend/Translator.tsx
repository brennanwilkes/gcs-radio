import * as React from "react";

import {I18nextProvider} from "react-i18next";
import i18next from "i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';




import common_en from "../translations/en/common.json";
import common_de from "../translations/de/common.json";
import common_fr from "../translations/fr/common.json";
import common_it from "../translations/it/common.json";
import common_ja from "../translations/ja/common.json";
import common_no from "../translations/no/common.json";
import common_pt from "../translations/pt/common.json";
import common_sv from "../translations/sv/common.json";
import common_zh from "../translations/zh/common.json";

const i18nInitialized = i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        detection: {
            lookupQuerystring: "lang"
        },
        fallbackLng: "en",
        interpolation: { escapeValue: false },
        resources: {
            en: {
                common: common_en
            },
            de: {
                common: common_de
            },
            fr: {
                common: common_fr
            },
            it: {
                common: common_it
            },
            ja: {
                common: common_ja
            },
            no: {
                common: common_no
            },
            pt: {
                common: common_pt
            },
            sv: {
                common: common_sv
            },
            zh: {
                common: common_zh
            }
        },
        react: {
            useSuspense: false,
            wait: true
        }
    });

export default ({ children } : { children: any }) => (
	<I18nextProvider i18n={i18next}>{
		children
	}</I18nextProvider>
);
export {i18nInitialized, i18next, I18nextProvider};
