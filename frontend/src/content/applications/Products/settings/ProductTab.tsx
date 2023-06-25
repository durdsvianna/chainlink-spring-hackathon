import { useState, forwardRef, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import bgimage from 'src/images/image.svg';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Box, TextField, CardMedia, Typography, Card, CardHeader, Divider, Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import { useIpfsUploader } from "src/utils/IpfsUtils"
import { useMintToken, useProduct } from "src/utils/Web3Erc721Utils"
import { useDateFormatter } from 'src/utils/DateUtils';
import { useSigner } from 'wagmi';
import UserProfile from 'src/components/User/UserProfile';
import { Alert, CardActionsWrapper, CardCover, CardCoverAction } from './StyleImports';

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

// Notebook | Tablet | Smartphone --> Produto ( SmartPhone )
// Fabricantes --> Apple
// Modelos de Smartphone do Fabricante --> Categoria do Produto ( 5S )

const ProductFabricant = [
{
  value: '1', label: 'Apple'
},
{
  value: '2', label: 'Samsung',
},
{
  value: '3', label: 'Motorolla'
}
];

const DeviceType = [
  {
    value: '1', label: 'Notebook'
  },
  {
    value: '2', label: 'Smartphone',
  },
  {
    value: '3', label: 'Tablet'
  }
  ];

const schema = yup.object({
  model: yup.string().required('Campo obrigatório.')
}).required();

function ProductTab({ data }) {
  const user = UserProfile();
  const creator = user.name;
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const [openInformartion, setOpenInformartion] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [fabricant, setFabricant] = useState('');
  const [model, setModel] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [imageCover, setImageCover] = useState(bgimage);
  const [image, setImage] = useState<string | ArrayBuffer>();
  const [imageFile, setImageFile] = useState<File>();
  const [url, setUrl] = useState('src/images/image.svg');
  const [imageCoverLoaded, setImageCoverLoaded] = useState(false);
  const { data: signer, isError, isLoading } = useSigner();
  
  const { uploadToInfura, uploadFileToPinata, uploadJsonToPinata, uploadFileResult, setUploadFileResult, uploadJsonResult, setUploadJsonResult } = useIpfsUploader();
  const { loading, setLoading, isMinted, safeMint } = useMintToken(uploadJsonResult);
  const { loadingSaveProduct, setLoadingSaveProduct, saveProduct } = useProduct();
  const { getFormattedDate, languageFormat, setLanguageFormat } = useDateFormatter('pt-BR');

  // Produto é NFT
  const [nft, setNft] = useState({
    deviceType: '',
    model: '',
    image: '',
    fabricant: '',
    external_url: process.env.REACT_APP_ERC721_METADATA_EXTERNAL_LINK,
    attributes: []
  });


  const createProduct = async (deviceType: string, model: string, fabricant: string, image: string, price: string) => {
    setLoading(true);    
    saveProduct(deviceType, model, fabricant, image, price);
    setLoading(false);

  }

  const onSubmit = async (event: { preventDefault: () => void; }) => {
    console.log("ENTROU NO SUBMIT")
    nft.attributes = [...nft.attributes, {
      trait_type: 'Model',
      value: model
    }];

    nft.attributes = [...nft.attributes, {
      trait_type: 'Device Type',
      value: deviceType
    }];

    //armazena imagem IPFS
    try {
      const ipfsImageResult = await uploadFileToPinata(imageFile);
      setUploadFileResult(ipfsImageResult);
      nft.image = ipfsImageResult.IpfsHash.toString();
      console.log("ipfsImageResult", ipfsImageResult);
    } catch (error) {
      setOpenError(true);
      console.log("Erro: ", error);
    }

    //guarda metadata no ipfs e realiza o mint
    try {
      const ipfsJsonResult = await uploadJsonToPinata(JSON.stringify(nft), "tokenUri.json");
      setUploadJsonResult(ipfsJsonResult);
      //mintNft(ipfsJsonResult.IpfsHash, process.env.REACT_APP_DAPP_CONTRACT);
      createProduct(deviceType, model, fabricant, ipfsJsonResult.IpfsHash.toString(), "10");
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

  const handleChangeModel = (event) => {
    setModel(event.target.value);
    nft.model = event.target.value;
  };

  const handleChangeFabricant = (event) => {
    setFabricant(event.target.value);
    nft.attributes = [...nft.attributes, {
      trait_type: 'Fabricant',
      value:  event.target.value
    }];
  };

  const handleChangeDeviceType = (event) => {
    setDeviceType(event.target.value);
    nft.deviceType = event.target.value;
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    let reader = new FileReader()
    setImageFile(file);
    reader.readAsDataURL(file)
    reader.onload = () => {
      setImage(reader.result);
      setUrl(URL.createObjectURL(file));
      console.log("url", url);
    }
    setImageCoverLoaded(true);
  }, [setImageFile]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: { 'image/*': [] },
    noClick: true,
    noKeyboard: true
  }
  );

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
        <CardHeader title="Cadastre seu Eletroeletrônico" />
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1 }
          }}
          onSubmit={handleSubmit(onSubmit)}
        >
          {
            data && data.tokenId >= 0
              ?
              (
                <CardCover >
                  <CardMedia
                    sx={{ minHeight: 280 }}
                    image={data.image}
                    title="Activity NFT"
                  />
                </CardCover>
              )
              : (
                <div  {...getRootProps({ className: 'md:h-52 sm:h-44 h-auto bg-light-grey border-2 border-light-blue border-dashed rounded-md' })}>
                  <CardCover >
                    <CardMedia
                      sx={{ minHeight: 280 }}
                      image={imageCoverLoaded ? url : imageCover}
                      title="Cadastrar Produto Eletroeletrônico"
                    />
                    <CardCoverAction>
                      <input {...getInputProps({ name: 'image' })} id="change-cover" multiple />
                      <p className='text-slate-400 md:text-md text-center mt-4 text-sm'>Adicionar Imagem</p>
                      <label htmlFor="change-cover">
                        <Button
                          startIcon={<UploadTwoToneIcon />}
                          variant="contained"
                          component="span"
                        >
                          Change image
                        </Button>
                      </label>
                    </CardCoverAction>
                  </CardCover>
                </div>
              )
          }
          <Box p={3}
          justifyContent='center'
          textAlign='center'>
            <Typography variant="h2" sx={{ pb: 1 }}>
              Adicionar Eletroeletrônico
            </Typography>
          </Box>
          <Divider />

          <CardActionsWrapper
            sx={{
              display: { xs: 12, md: 3 },
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >

            <Box
              sx={{
                '& .MuiTextField-root': { m: 1 }
              }}
            >
              <div>
                <TextField fullWidth 
                  select
                  label={data && data.deviceType ? '' : 'Tipo de Produto'}
                  value={data && data.deviceType ? data.deviceType : deviceType}
                  onChange={handleChangeDeviceType}
                  disabled={data && data.tokenId >= 0 ? true : false}
                  SelectProps={{
                    native: true
                  }}
                >    
                 {DeviceType.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}         
                </TextField> 

            
              </div>

              <div>
                <TextField fullWidth 
                  select
                  label={data && data.product ? '' : 'Fabricante'}
                  value={data && data.product ? data.product : fabricant}
                  onChange={handleChangeFabricant}
                  disabled={data && data.tokenId >= 0 ? true : false}
                  SelectProps={{
                    native: true
                  }}
                >    
                 {ProductFabricant.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}         
                  </TextField> 

            
              </div>
              
              <div>
                <TextField fullWidth {...register("model")} 
                  label={data && data.name ? '' : 'Modelo do Dispositivo'}
                  onChange={handleChangeModel}
                  placeholder={data && data.name ? '' : 'Ex: 5S'}
                  disabled={data && data.tokenId >= 0 ? true : false}
                  value={data && data.model ? data.model : model}
                />
                <p>{errors.title?.message}</p>
              </div>


              
              {/* <div> 
              <TextField fullWidth {...register("MEI")}
                  id="outlined-required"
                  label={data && data.name ? '' : 'MEI'}
                  onChange={handleChangeMEI}
                  placeholder={data && data.name ? '' : 'Ex: ESP240623'}
                  disabled={data && data.tokenId >= 0 ? true : false}
                  value={data && data.name}
                />
                <p>{errors.title?.message}</p>
              </div> */}
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
                    Cadastrar Produto
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

export default ProductTab;
