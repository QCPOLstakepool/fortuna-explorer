from model.FortunaBlock import FortunaBlock


class CardanoAdapterInterface:
    def get_latest_block(self) -> FortunaBlock:
        pass

    def get_blocks(self, page: int, size: int, from_block: int, desc: bool) -> list[FortunaBlock]:
        pass
