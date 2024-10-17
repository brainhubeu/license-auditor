import type { LicenseId } from "@license-auditor/licenses";

const licenses: {
  modulePath: string;
  license: LicenseId;
  licensePath: string;
}[] = [
  {
    modulePath: "./node_modules/react",
    license: "MIT",
    licensePath: "./node_modules/react/package.json",
  },
  {
    modulePath: "./node_modules/react-dom",
    license: "MIT",
    licensePath: "./node_modules/react-dom/package.json",
  },
  {
    modulePath: "./node_modules/prop-types",
    license: "MIT",
    licensePath: "./node_modules/prop-types/package.json",
  },
  {
    modulePath: "./node_modules/redux",
    license: "MIT",
    licensePath: "./node_modules/redux/package.json",
  },
  {
    modulePath: "./node_modules/react-redux",
    license: "MIT",
    licensePath: "./node_modules/react-redux/package.json",
  },
  {
    modulePath: "./node_modules/react-router",
    license: "MIT",
    licensePath: "./node_modules/react-router/package.json",
  },
  {
    modulePath: "./node_modules/react-router-dom",
    license: "MIT",
    licensePath: "./node_modules/react-router-dom/package.json",
  },
  {
    modulePath: "./node_modules/axios",
    license: "MIT",
    licensePath: "./node_modules/axios/package.json",
  },
  {
    modulePath: "./node_modules/react-spring",
    license: "MIT",
    licensePath: "./node_modules/react-spring/package.json",
  },
  {
    modulePath: "./node_modules/styled-components",
    license: "MIT",
    licensePath: "./node_modules/styled-components/package.json",
  },
  {
    modulePath: "./node_modules/framer-motion",
    license: "MIT",
    licensePath: "./node_modules/framer-motion/package.json",
  },
  {
    modulePath: "./node_modules/react-query",
    license: "MIT",
    licensePath: "./node_modules/react-query/package.json",
  },
  {
    modulePath: "./node_modules/react-testing-library",
    license: "MIT",
    licensePath: "./node_modules/react-testing-library/package.json",
  },
  {
    modulePath: "./node_modules/emotion",
    license: "MIT",
    licensePath: "./node_modules/emotion/package.json",
  },
  {
    modulePath: "./node_modules/react-hook-form",
    license: "MIT",
    licensePath: "./node_modules/react-hook-form/package.json",
  },
  {
    modulePath: "./node_modules/formik",
    license: "MIT",
    licensePath: "./node_modules/formik/package.json",
  },
  {
    modulePath: "./node_modules/immer",
    license: "MIT",
    licensePath: "./node_modules/immer/package.json",
  },
  {
    modulePath: "./node_modules/recharts",
    license: "ISC",
    licensePath: "./node_modules/recharts/package.json",
  },
  {
    modulePath: "./node_modules/react-bootstrap",
    license: "MIT",
    licensePath: "./node_modules/react-bootstrap/package.json",
  },
  {
    modulePath: "./node_modules/material-ui",
    license: "MIT",
    licensePath: "./node_modules/material-ui/package.json",
  },
  {
    modulePath: "./node_modules/antd",
    license: "MIT",
    licensePath: "./node_modules/antd/package.json",
  },
  {
    modulePath: "./node_modules/react-toastify",
    license: "MIT",
    licensePath: "./node_modules/react-toastify/package.json",
  },
  {
    modulePath: "./node_modules/react-router-config",
    license: "MIT",
    licensePath: "./node_modules/react-router-config/package.json",
  },
  {
    modulePath: "./node_modules/classnames",
    license: "MIT",
    licensePath: "./node_modules/classnames/package.json",
  },
  {
    modulePath: "./node_modules/react-slick",
    license: "MIT",
    licensePath: "./node_modules/react-slick/package.json",
  },
  {
    modulePath: "./node_modules/react-helmet",
    license: "MIT",
    licensePath: "./node_modules/react-helmet/package.json",
  },
  {
    modulePath: "./node_modules/rc-slider",
    license: "MIT",
    licensePath: "./node_modules/rc-slider/package.json",
  },
  {
    modulePath: "./node_modules/react-transition-group",
    license: "MIT",
    licensePath: "./node_modules/react-transition-group/package.json",
  },
  {
    modulePath: "./node_modules/apollo-client",
    license: "MIT",
    licensePath: "./node_modules/apollo-client/package.json",
  },
  {
    modulePath: "./node_modules/react-table",
    license: "MIT",
    licensePath: "./node_modules/react-table/package.json",
  },
  {
    modulePath: "./node_modules/react-i18next",
    license: "MIT",
    licensePath: "./node_modules/react-i18next/package.json",
  },
  {
    modulePath: "./node_modules/swr",
    license: "MIT",
    licensePath: "./node_modules/swr/package.json",
  },
  {
    modulePath: "./node_modules/redux-thunk",
    license: "MIT",
    licensePath: "./node_modules/redux-thunk/package.json",
  },
  {
    modulePath: "./node_modules/react-dnd",
    license: "MIT",
    licensePath: "./node_modules/react-dnd/package.json",
  },
  {
    modulePath: "./node_modules/react-beautiful-dnd",
    license: "MIT",
    licensePath: "./node_modules/react-beautiful-dnd/package.json",
  },
  {
    modulePath: "./node_modules/@emotion/styled",
    license: "MIT",
    licensePath: "./node_modules/@emotion/styled/package.json",
  },
  {
    modulePath: "./node_modules/react-hot-toast",
    license: "MIT",
    licensePath: "./node_modules/react-hot-toast/package.json",
  },
  {
    modulePath: "./node_modules/react-icons",
    license: "MIT",
    licensePath: "./node_modules/react-icons/package.json",
  },
  {
    modulePath: "./node_modules/react-snapshot",
    license: "MIT",
    licensePath: "./node_modules/react-snapshot/package.json",
  },
  {
    modulePath: "./node_modules/react-leaflet",
    license: "MIT",
    licensePath: "./node_modules/react-leaflet/package.json",
  },
  {
    modulePath: "./node_modules/react-select",
    license: "MIT",
    licensePath: "./node_modules/react-select/package.json",
  },
  {
    modulePath: "./node_modules/react-datetime",
    license: "MIT",
    licensePath: "./node_modules/react-datetime/package.json",
  },
  {
    modulePath: "./node_modules/react-autosuggest",
    license: "MIT",
    licensePath: "./node_modules/react-autosuggest/package.json",
  },
  {
    modulePath: "./node_modules/react-player",
    license: "MIT",
    licensePath: "./node_modules/react-player/package.json",
  },
  {
    modulePath: "./node_modules/react-image-gallery",
    license: "MIT",
    licensePath: "./node_modules/react-image-gallery/package.json",
  },
  {
    modulePath: "./node_modules/react-infinite-scroller",
    license: "MIT",
    licensePath: "./node_modules/react-infinite-scroller/package.json",
  },
  {
    modulePath: "./node_modules/react-lottie",
    license: "MIT",
    licensePath: "./node_modules/react-lottie/package.json",
  },
  {
    modulePath: "./node_modules/react-swipeable-views",
    license: "MIT",
    licensePath: "./node_modules/react-swipeable-views/package.json",
  },
  {
    modulePath: "./node_modules/react-big-calendar",
    license: "MIT",
    licensePath: "./node_modules/react-big-calendar/package.json",
  },
  {
    modulePath: "./node_modules/react-copy-to-clipboard",
    license: "MIT",
    licensePath: "./node_modules/react-copy-to-clipboard/package.json",
  },
];

export { licenses };
