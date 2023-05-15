import { useEffect } from 'react';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useContractAccessControl } from 'src/utils/Web3Erc721Utils';
import { useAccount } from 'wagmi';
import SuspenseLoader from 'src/components/SuspenseLoader';

const ListWrapper = styled(Box)(
  ({ theme }) => `
        .MuiTouchRipple-root {
            display: none;
        }
        
        .MuiListItem-root {
            transition: ${theme.transitions.create(['color', 'fill'])};
            
            &.MuiListItem-indicators {
                padding: ${theme.spacing(1, 2)};
            
                .MuiListItemText-root {
                    .MuiTypography-root {
                        &:before {
                            height: 4px;
                            width: 22px;
                            opacity: 0;
                            visibility: hidden;
                            display: block;
                            position: absolute;
                            bottom: -10px;
                            transition: all .2s;
                            border-radius: ${theme.general.borderRadiusLg};
                            content: "";
                            background: ${theme.colors.primary.main};
                        }
                    }
                }

                &.active,
                &:active,
                &:hover {
                
                    background: transparent;
                
                    .MuiListItemText-root {
                        .MuiTypography-root {
                            &:before {
                                opacity: 1;
                                visibility: visible;
                                bottom: 0px;
                            }
                        }
                    }
                }
            }
        }
`
);

function HeaderMenu() {
  const { isConnected } = useAccount();
  const { loading, setLoading, isLeader, checkLeader } =
    useContractAccessControl();

  const validateLeader = async () => {
    setLoading(true);
    checkLeader();
    setLoading(false);
  };

  useEffect(() => {
    if (!loading) validateLeader();
  });

  useEffect(() => {
    console.log('loading', loading);
    console.log('isLeader', isLeader);
  }, [loading, isLeader]);

  return (
    <>
      <ListWrapper
        sx={{
          display: {
            xs: 'none',
            md: 'block'
          }
        }}
      >
        <List disablePadding component={Box} display="flex">
          <ListItem
            classes={{ root: 'MuiListItem-indicators' }}
            button
            component={NavLink}
            to="/dapp"
          >
            <img src="../../../web3dev.png" alt="Web3Dev" />
          </ListItem>          
          { loading ? <SuspenseLoader />
           :
            isLeader ?
            isConnected &&  (<>
              <ListItem
                classes={{ root: 'MuiListItem-indicators' }}
                button
                component={NavLink}
                to="/dapp/warranties"
              >
                <ListItemText 
                  primaryTypographyProps={{ noWrap: true }}
                  primary={ 
                  <Typography color={'white'} sx={{ "&:hover": { color: "green" } }}>Warranties</Typography>
                  }
                />
              </ListItem>
              <ListItem
                classes={{ root: 'MuiListItem-indicators' }}
                button
                component={NavLink}
                to="/dapp/activities"
              >
                <ListItemText 
                  primaryTypographyProps={{ noWrap: true }}
                  primary={ 
                  <Typography color={'white'} sx={{ "&:hover": { color: "green" } }}>Activities</Typography>
                  }
                />
              </ListItem>              
            </>
            )
          ) : (
            <></>
          )}
        </List>
      </ListWrapper>
    </>
  );
}

export default HeaderMenu;
