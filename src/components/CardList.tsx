import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

export interface CardData {
  id: string;
  title: string;
  description: string;
  url: string;
  ts: number;
}

interface CardsProps {
  cards: CardData[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [modalUrl, setModalUrl] = useState('');

  const handleModal = (url: string): void => {
    onOpen();
    setModalUrl(url);
  };

  return (
    <>
      <SimpleGrid columns={3} spacing="10">
        {cards.map(card => (
          <Card key={card.id} data={card} viewImage={handleModal} />
        ))}
      </SimpleGrid>
      <ModalViewImage imgUrl={modalUrl} isOpen={isOpen} onClose={onClose} />
    </>
  );
}
