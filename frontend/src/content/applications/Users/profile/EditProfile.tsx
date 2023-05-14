import { useState } from 'react';
import { Grid, Button, Avatar, IconButton, CardMedia } from '@mui/material';
import {
  AvatarWrapper,
  ButtonUploadWrapper,
  CardCover,
  CardCoverAction,
  Input
} from './StyledImports';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import UserEditPersonalDetails from 'src/components/User/UserEditPersonalDetails';

function EditProfileTab({ user: UserProfile }) {
  const [cover, setCover] = useState(UserProfile.coverImg);
  const [avatar, setAvatar] = useState(UserProfile.avatar);

  const handleChangeCover = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setCover(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleChangeAvatar = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setAvatar(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <CardCover>
          <CardMedia image={cover} />
          <CardCoverAction>
            <Input
              accept="image/*"
              id="change-cover"
              multiple
              type="file"
              onChange={handleChangeCover}
            />
            <label htmlFor="change-cover">
              <Button
                startIcon={<UploadTwoToneIcon />}
                variant="contained"
                component="span"
                onChange={handleChangeCover}
              >
                Modificar papel de parede
              </Button>
            </label>
          </CardCoverAction>
        </CardCover>
        <AvatarWrapper>
          <Avatar variant="rounded" alt={UserProfile.name} src={avatar} />
          <ButtonUploadWrapper>
            <Input
              accept="image/*"
              id="icon-button-file"
              name="icon-button-file"
              type="file"
              onChange={handleChangeAvatar}
            />
            <label htmlFor="icon-button-file">
              <IconButton component="span" color="primary">
                <UploadTwoToneIcon />
              </IconButton>
            </label>
          </ButtonUploadWrapper>
        </AvatarWrapper>
      </Grid>
      <UserEditPersonalDetails user={UserProfile} />
    </Grid>
  );
}

export default EditProfileTab;
