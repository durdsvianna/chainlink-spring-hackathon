import { Dialog, TextField, DialogTitle } from '@mui/material';
import { styled } from '@mui/material/styles';
export const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-container {
          height: auto;
      }
      
      .MuiDialog-paperScrollPaper {
          max-height: calc(100vh - 64px)
      }
  `
);

export const SearchInputWrapper = styled(TextField)(
  ({ theme }) => `
      background: ${theme.colors.alpha.white[100]};
  
      .MuiInputBase-input {
          font-size: ${theme.typography.pxToRem(17)};
      }
  `
);

export const DialogTitleWrapper = styled(DialogTitle)(
  ({ theme }) => `
      background: ${theme.colors.alpha.black[5]};
      padding: ${theme.spacing(3)}
  `
);
