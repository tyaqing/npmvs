import { ref } from "vue";

// loading
export const useSpinning = () => {
  const spinning = ref<boolean>(false);
  const showSpinning = () => {
    spinning.value = true;
  };
  const hideSpinning = () => {
    spinning.value = false;
  };
  return { spinning, showSpinning, hideSpinning };
};
