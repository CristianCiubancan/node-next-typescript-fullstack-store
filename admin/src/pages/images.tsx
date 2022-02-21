import { Box, Button, Flex, useToast } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import ImageSelector from "../components/Images/ImageSelector";
import Layout from "../components/Layout";
import DeleteImagesOperation from "../operations/images/deleteImages";
import GetImagesOperation from "../operations/images/getImages";
import UploadImagesOperation from "../operations/images/uploadImages";
import LogoutOperation from "../operations/user/logout";
import { CurrentUser } from "../redux/features/user/userSlice";
import { wrapper } from "../redux/store";
import { Img } from "../types/product";

interface ImagesProps {
  images: Img[];
  currentUser: CurrentUser;
}

const Images: React.FC<ImagesProps> = ({ images, currentUser }) => {
  const [imagesArray, setImagesArray] = useState<Img[]>(images);
  const [selectedPhotos, setSelectedPhotos] = useState<Img[]>([]);
  const [isUploadLoading, setIsUploadLoading] = useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const toast = useToast();

  const handleImagesDelete = async () => {
    setIsDeleteLoading(true);
    const response = await DeleteImagesOperation(selectedPhotos);
    const imagesResponse = await GetImagesOperation();

    if (response.error) {
      if (response.error === "Your session expired, please relog") {
        await LogoutOperation();
        window.location.href = "/login";
      } else {
        setErrorMessage(response.error);
        setIsDeleteLoading(false);
      }
    } else {
      setImagesArray(imagesResponse);
      setSelectedPhotos([]);
      setIsDeleteLoading(false);
      toast({
        title: "Images removed.",
        description: `${selectedPhotos.length} images successflly removed.`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const onDrop = useCallback(async (files) => {
    setIsUploadLoading(true);
    if (files.length) {
      const formData = new FormData();
      files.forEach((file: any) => formData.append(file.name, file));
      const response = await UploadImagesOperation(formData);
      if (response.error) {
        if (response.error === "Your session expired, please relog") {
          await LogoutOperation();
          window.location.href = "/login";
        } else {
          setErrorMessage(response.error);
          setIsUploadLoading(false);
        }
      } else {
        const imagesResponse = await GetImagesOperation();
        setImagesArray(imagesResponse);
        setIsUploadLoading(false);

        toast({
          title: "Images added.",
          description: `${files.length} images successflly added.`,
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png, image/webp",
    multiple: false,
    maxSize: 10000000,
  });

  return (
    <Layout currentUser={currentUser}>
      <Flex flexDirection={"column"}>
        <Flex
          p={2}
          position={"sticky"}
          zIndex={1}
          backgroundColor={"white"}
          top={"4em"}>
          <Button
            w={"100%"}
            colorScheme={"teal"}
            {...getRootProps()}
            isLoading={isUploadLoading}>
            Upload images
            <input name="imageUrl" {...getInputProps()} />
          </Button>
          {selectedPhotos.length ? (
            <Button
              isLoading={isDeleteLoading}
              colorScheme={"red"}
              ml={2}
              onClick={handleImagesDelete}>
              Delete
            </Button>
          ) : null}
        </Flex>
        <Box px={2}>
          <ImageSelector
            images={imagesArray}
            selectedPhotos={selectedPhotos}
            setSelectedPhotos={setSelectedPhotos}
          />
        </Box>
      </Flex>
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    const images = await GetImagesOperation();

    return { props: { images } };
  }
);

export default Images;
