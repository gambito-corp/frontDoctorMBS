import React from 'react';
import Container from '../atoms/Container';
import ContentBox from '../molecules/ContentBox';

const MainContent = ({ children }) => {
    return (
        <div className="py-12">
            <Container className="main-chat-bot">
                <ContentBox className="box-chat">
                    {children}
                </ContentBox>
            </Container>
        </div>
    );
};

export default MainContent;
