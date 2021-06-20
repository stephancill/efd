
def test_efs_deploy(efs):
    """
    Test if the contract is correctly deployed.
    """
    print(efs)
    assert 1 == 1
    # TODO: Test everything


# def test_solidity_storage_set(accounts, efs):
#     """
#     Test if the storage variable can be changed.
#     """
#     solidity_storage.set(20, {'from': accounts[0]})
#     assert solidity_storage.get() == 20
