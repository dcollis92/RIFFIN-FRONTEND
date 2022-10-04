// Components / hooks
import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "containers/CognitoUserProvider/CognitoUserProvider";
import { TagContext } from "containers/TagProvider/TagProvider";
// MUI
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Button from '@mui/material/Button';

const CreateBassTabButton = () => {  
  const [variant, setVariant] = useState("text")
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useContext(UserContext)
  const { clearTags } = useContext(TagContext);

  const handleClick = () => {
    clearTags();
    user ? navigate(`/new/bass`) : navigate('/login')
  }

  useEffect(()=> {
    const urlData = location.pathname.split('/')
    const path = urlData[2]
    if(path === 'bass') {
      setVariant("contained")
    } else {
      setVariant("text")
    }
  }, [location, user])

  return (
    <Button
      startIcon={<AddCircleIcon />}
      onClick={handleClick}
      sx={{fontWeight: "bold", justifyContent: 'left', my: 0.5, textTransform: 'none'}}
      disableElevation
      variant={variant}
      size="large"
    >
      Bass tab
    </Button>
  )

}

export default CreateBassTabButton