import React, { useState } from "react";
import useRetrieveProfile from "../hooks/useRetrieveProfile";
import UpdateProfileDialog from "../components/UpdateProfileDialog";
import { ProfileFieldName } from "../types";
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
} from "@chakra-ui/react";

const Profile = () => {
  const { data: profile, error } = useRetrieveProfile();
  const [openDialog, setOpenDialog] = useState(false);
  const [titleDialog, setTitleDialog] = useState("");
  const [fieldNameDialog, setFieldNameDialog] = useState<ProfileFieldName>();
  const handleOpen = (open: boolean | undefined) => {
    if (open == undefined) setOpenDialog(!openDialog);
    else setOpenDialog(open);
  };

  if (error) throw error;

  if (!profile) return null;

  const handleUpdateClick = (title: string, name: ProfileFieldName) => {
    setOpenDialog(true);
    setTitleDialog(title);
    setFieldNameDialog(name);
  };

  return (
    <Box>
      <Container maxW="xl" py="60px">
        <HStack py="14px" px="21px" bgColor="#c0e2cf" borderTopRadius="lg">
          <Heading fontSize="lg" color="primary">
            My profile
          </Heading>
        </HStack>
        <TableContainer borderColor="#e5e5e5" borderWidth="1px">
          <Table variant="simple">
            <Tbody>
              <Tr>
                <Td fontWeight="semibold">First name</Td>
                <Td>{profile.firstName}</Td>
                <Td>
                  <Button
                    onClick={() => handleUpdateClick("First name", "firstName")}
                  >
                    Update
                  </Button>
                </Td>
              </Tr>
              <Tr>
                <Td fontWeight="semibold">Last name</Td>
                <Td>{profile.lastName}</Td>
                <Td>
                  <Button
                    onClick={() => handleUpdateClick("Last name", "lastName")}
                  >
                    Update
                  </Button>
                </Td>
              </Tr>
              <Tr>
                <Td fontWeight="semibold">Email</Td>
                <Td>{profile.email}</Td>
                <Td>
                  <Button onClick={() => handleUpdateClick("Email", "email")}>
                    Update
                  </Button>
                </Td>
              </Tr>
              <Tr>
                <Td fontWeight="semibold">Phone number</Td>
                <Td>{profile.phone}</Td>
                <Td>
                  <Button
                    onClick={() => handleUpdateClick("Phone number", "phone")}
                  >
                    Update
                  </Button>
                </Td>
              </Tr>
              <Tr>
                <Td fontWeight="semibold">Address</Td>
                <Td>{profile.address}</Td>
                <Td>
                  <Button
                    onClick={() => handleUpdateClick("Address", "address")}
                  >
                    Update
                  </Button>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
        <UpdateProfileDialog
          open={openDialog}
          handler={handleOpen}
          title={titleDialog}
          fieldName={fieldNameDialog}
          profile={profile}
        />
      </Container>
    </Box>
  );
};

export default Profile;
