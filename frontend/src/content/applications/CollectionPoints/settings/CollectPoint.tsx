import { useState, forwardRef, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, TextField, CardMedia, Typography, Card, CardHeader, Divider, Button, CardActions} from '@mui/material';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import { Dayjs } from 'dayjs';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import { useIpfsUploader } from "src/utils/IpfsUtils"
import { useMintToken } from "src/utils/Web3Erc721Utils"
import { useDateFormatter } from 'src/utils/DateUtils';
import { useSigner, useProvider, usePrepareContractWrite, useContractWrite } from 'wagmi';
import NftERC721Artifact from "src/contracts/NftERC721.json";
import contractAddress from "src/contracts/contract-nfterc721-address.json";
import UserProfile from 'src/components/User/UserProfile';

import {Alert, CardActionsWrapper, CardCover, CardCoverAction } from '../../Products/settings/StyleImports';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumericFormatCustom = forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        valueIsNumericString
        prefix="$"
      />
    );
  },
);

const LocalizationLabel
 = [
  {
    value: '1',
    label: 'Ex: São Paulo'
  },
  {
    value: '2',
    label: 'Ex; Rio de Janeiro'
  },
  {
    value: '3',
    label: 'Fortaleza'
  }
];

const schema = yup.object({
  Localization: yup.string().required('Campo obrigatório.'),
  description: yup.string().required('Campo obrigatório.'),
}).required();

function CollectPoint({ data }) {
  const user = UserProfile();
  const creator = user.name;
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const [openInformartion, setOpenInformartion] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [valueReward, setValueReward] = useState<number>(0);
  const [activityStatus, setActivityStatus] = useState('');
  const [localization, setLocalization] = useState('');
  const [expireDate, setExpireDate] = useState<DatePickerProps<Dayjs> | null>(null);
  const [url, setUrl] = useState('src/images/image.svg');
  const { data: signer, isError, isLoading } = useSigner();
  //const provider = useProvider();
  const [nft, setNft] = useState({
    name: '',
    description: '',
    image: '',
    external_url: process.env.REACT_APP_ERC721_METADATA_EXTERNAL_LINK,
    background_color: '',
    animation_url: '',
    youtube_url: '',
    attributes: []
  });
  const { uploadToInfura, uploadFileToPinata, uploadJsonToPinata, uploadFileResult, setUploadFileResult, uploadJsonResult, setUploadJsonResult } = useIpfsUploader();
  const { loading, setLoading, isMinted, safeMint } = useMintToken(uploadJsonResult);
  const { getFormattedDate, languageFormat, setLanguageFormat } = useDateFormatter('pt-BR');

  const mintNft = async (tokenUri, to) => {
    setLoading(true);
    safeMint(to, tokenUri, "0");
    setLoading(false);
    
  }

  const onSubmit = async (event: { preventDefault: () => void; }) => {
    nft.attributes = [...nft.attributes, {
      trait_type: 'Expire Date',
      value: expireDate
    }];

    nft.attributes = [...nft.attributes, {
      trait_type: 'Rewards',
      value: valueReward
    }];

    //guarda metadata no ipfs e realiza o mint
    try {
      const ipfsJsonResult = await uploadJsonToPinata(JSON.stringify(nft), "tokenUri.json");
      setUploadJsonResult(ipfsJsonResult);
      mintNft(ipfsJsonResult.IpfsHash, process.env.REACT_APP_DAPP_CONTRACT);
      setOpenInformartion(true);
    } catch (error) {
      console.log("Erro: ", error);
    }
  };

  const handleCloseSnackInformation = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenInformartion(false);
  };

  const handleCloseSnackError = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenError(false);
  };

  const handleChangeLocalization = (event) => {
    setLocalization(event.target.value);
    nft.name = event.target.value;
  };

  const handleChangeStatus = (event) => {
    setActivityStatus(event.target.value);
    nft.attributes = [...nft.attributes, {
      trait_type: 'Status',
      value: event.target.value
    }];
  };

  const handleChangeDificulty = (event) => {
    setLocalization(event.target.value);
    nft.attributes = [...nft.attributes, {
      trait_type: 'Localization',
      value: event.target.value
    }];
  };
  const handleChangeReward = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setValueReward(value);
  };


  useEffect(() => {

    console.log("data", data)

  }, [data]);

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={openInformartion} autoHideDuration={6000} onClose={handleCloseSnackInformation}>
        <Alert onClose={handleCloseSnackInformation} severity="info" sx={{ width: '100%' }}>
          Mint process initiated!
        </Alert>
      </Snackbar>
      <Snackbar open={openError} autoHideDuration={6000} onClose={handleCloseSnackError}>
        <Alert onClose={handleCloseSnackError} severity="error" sx={{ width: '100%' }}>
          Activity not minted! Try again!
        </Alert>
      </Snackbar>
      <Card>
        <CardHeader Localization="Register your Collection Point" />
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1 }
          }}
          onSubmit={handleSubmit(onSubmit)}
        >

          <Box p={3}>
            <Typography variant="h2" sx={{ pb: 1 }}>
              Collect Point
            </Typography>
          </Box>
          <Divider />

          <CardActionsWrapper
            sx={{
              display: { xs: 12, md: 3 },
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >

            <Box
              sx={{
                '& .MuiTextField-root': { m: 1 }
              }}
            >

                
              <div>

                <TextField fullWidth
                  id="outlined-select-currency-native"
                  select
                  label={data && data.Localization ? '' : 'Localization'}
                  value={data && data.Localization ? data.Localization : localization}
                  disabled={data && data.tokenId >= 0 ? true : false}
                  onChange={handleChangeDificulty}
                  SelectProps={{
                    native: true
                  }}  
                >
                  {LocalizationLabel
                  .map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
                
              </div>
            </Box>
          </CardActionsWrapper>


          {data && data.tokenId ? <></>
            :
            (
              <CardActionsWrapper
                sx={{
                  display: { xs: 'block', md: 'flex' },
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                </Box>
                <Box sx={{ mt: { xs: 2, md: 0 } }}>
                  <Button type="submit" variant="contained">
                    Create Activity
                  </Button>
                </Box>
              </CardActionsWrapper>
            )
          }
        </Box>
      </Card>
    </Stack>
  );
}

export default CollectPoint;
