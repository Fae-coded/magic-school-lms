import { Card } from "../components/Card";
import { CardContainer } from "../components/CardContainer";

export default function ManageUsers() {
  return (
    <CardContainer containerTitle="Manage Users">
        <Card 
          title="User Name"
          description="User Email"
          buttonText="Edit User"
          secondButtonText="Delete User"
          />
    </CardContainer>
  );
}