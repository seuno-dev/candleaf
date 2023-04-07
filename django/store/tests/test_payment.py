class TestCreatePayment:
    def test_returns_201(self, authenticate_client):
        client = authenticate_client()
