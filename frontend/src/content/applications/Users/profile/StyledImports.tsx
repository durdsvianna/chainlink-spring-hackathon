import { Box, Card, List, Tabs } from '@mui/material';
import { styled } from '@mui/material/styles';

export const AvatarWrapper = styled(Card)(
  ({ theme }) => `
      
          position: relative;
          overflow: visible;
          display: inline-block;
          margin-top: -${theme.spacing(9)};
          margin-left: ${theme.spacing(2)};
      
          .MuiAvatar-root {
            width: ${theme.spacing(16)};
            height: ${theme.spacing(16)};
          }
      `
);

export const ButtonUploadWrapper = styled(Box)(
  ({ theme }) => `
            position: absolute;
            width: ${theme.spacing(4)};
            height: ${theme.spacing(4)};
            bottom: -${theme.spacing(1)};
            right: -${theme.spacing(1)};
        
            .MuiIconButton-root {
              border-radius: 100%;
              background: ${theme.colors.primary.main};
              color: ${theme.palette.primary.contrastText};
              box-shadow: ${theme.colors.shadows.primary};
              width: ${theme.spacing(4)};
              height: ${theme.spacing(4)};
              padding: 0;
          
              &:hover {
                background: ${theme.colors.primary.dark};
              }
            }
        `
);

export const CardCover = styled(Card)(
  ({ theme }) => `
      position: relative;
  
      .MuiCardMedia-root {
        height: ${theme.spacing(26)};
      }
  `
);

export const CardCoverAction = styled(Box)(
  ({ theme }) => `
            position: absolute;
            right: ${theme.spacing(2)};
            bottom: ${theme.spacing(2)};
        `
);

export const Input = styled('input')({
  display: 'none'
});

export const ListWrapper = styled(List)(
  () => `
          .MuiListItem-root {
            border-radius: 0;
            margin: 0;
          }
    `
);

export const TabsWrapper = styled(Tabs)(
  () => `
      .MuiTabs-scrollableX {
        overflow-x: auto !important;
      }
  `
);
