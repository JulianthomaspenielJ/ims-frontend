// File: src/components/Imsproduct.jsx
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import securityimg from '../../assets/securityimg.avif';
import cloudimg from '../../assets/cloudimg.png';

const { Title, Text } = Typography;

const cardAnimation = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

const featureCardData = [
  {
    key: 'Cost',
    title: 'Cost',
    description: 'Cost Cloud provides real-time visibility into your cloud expenses across all services.',
    img: "https://www.shutterstock.com/image-photo/cost-reduction-concept-wording-on-600nw-2405339143.jpg",
    route: '/cost',
  },
  {
    key: 'Security',
    title: 'Security',
    description: 'IMS security continuously monitors, detects, and safeguards your cloud infrastructure and data.',
    img: securityimg,
    route: '/security',
  },
  {
    key: 'Operational Excellence',
    title: 'Operational Excellence',
    description: 'Our company strives for Operational Excellence by continuously improving processes',
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRr8MIn0_lXk26lbBEqZzEWec1koj6Wy33mw&s",
    route: '/operational',
  },
];

const Imsproduct = () => {
  const navigate = useNavigate();
  const [allowedFeatures, setAllowedFeatures] = useState([]);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return;
        const res = await fetch('http://localhost:8000/users/features', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setAllowedFeatures(data.features || []);
        }
      } catch (err) {
        setAllowedFeatures([]); // fallback: no features
      }
    };
    fetchFeatures();
  }, []);

  const isAllowed = (feature) =>
    allowedFeatures.includes(feature) ||
    allowedFeatures.includes(feature.replace('Operational Excellence', 'Operational Excellence'));

  return (
    <div
      style={{
        padding: '150px',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Row gutter={32} justify="center">
        {/* Cost Card */}
        {featureCardData.map((card) => {
          const blurred = !isAllowed(card.key);
          return (
            <Col key={card.key}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                whileHover={!blurred ? "hover" : undefined}
                variants={cardAnimation}
                viewport={{ once: true }}
                onClick={() => {
                  if (!blurred) navigate(card.route);
                }}
                style={{
                  cursor: blurred ? 'not-allowed' : 'pointer',
                  filter: blurred ? 'blur(3px) grayscale(0.7)' : 'none',
                  pointerEvents: blurred ? 'none' : 'auto',
                }}
              >
                <Card
                  style={{
                    width: 300,
                    borderRadius: '15px',
                    overflow: 'hidden',
                  }}
                  bodyStyle={{ padding: '20px', backgroundColor: '#91caff' }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        width: '100%',
                        height: '200px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px',
                      }}
                    >
                      <img src={card.img} alt={card.title} width="300px" height="230px" />
                    </div>
                    <Title level={4} style={{ margin: '20px 0' }}>{card.title}</Title>
                    <Text>{card.description}</Text>
                  </div>
                </Card>
              </motion.div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default Imsproduct;
             