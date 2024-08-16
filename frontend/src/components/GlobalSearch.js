import { useState, useCallback } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputGroup, Form, Button, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import objectType from 'xtypejs';
import {debounce} from 'lodash';

export default function GlobalSearch() {
    const [searchText, setSearchText] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const [menu, setMenu] = useState({});

    const handleSearch = useCallback(
        debounce((text) => {
            if (text && text.trim().length > 0) {
                axios.post('/globalSearch', {'text': text.toString()}).then((response) => {
                    setMenu(response.data);
                });
            } else setMenu({});
        }, 200), []
    );

    function getRelatedWords(item) {
        const relatedWords = Object.values(item).filter(value => {
            if (value && objectType(value) !== 'multi_prop_object')
                return value.toString().toLowerCase().includes(searchText.toLowerCase());
            return false;
        });
        if (relatedWords.length > 0) {
            const words = relatedWords[0].toString().split(new RegExp(`(${searchText})`, 'gi'));
            return (
                <> - {words.map((word, index) =>
                    word.toLowerCase() === searchText.toLowerCase() ? (
                        <span key={index} style={{ color: 'blue' }}>{word}</span>
                    ) : (
                        <span key={index} style={{ color: 'black' }}>{word}</span>
                    )
                )}</>
            );
        }
        return '';
    }

    return (
        <>
            <Dropdown show={showMenu} onHide={() => setShowMenu(false)}>
                <InputGroup style={{ width: '20vw' }}>
                    <Button variant='secondary'>
                        <FontAwesomeIcon icon='search' />
                    </Button>
                    <Form.Control
                        type='search'
                        style={{ backgroundColor: '#d3cbcb' }}
                        placeholder='Search'
                        value={searchText}
                        onChange={(event) => {
                            if (event.target.value.length < 20) {
                                const newValue = event.target.value;
                                setSearchText(newValue);
                                setShowMenu(newValue.length > 0);
                                handleSearch(newValue);
                            }
                        }}
                    />
                </InputGroup>

                <Dropdown.Menu className='scrollbar'>
                    {Object.keys(menu).length === 0 && (
                        <Dropdown.Header className='mt-1 d-flex justify-content-center'>
                            RESULTS NOT FOUND
                        </Dropdown.Header>
                    )}
                    {menu && Object.entries(menu).map(([key, value]) => (
                        <div key={key}>
                            <Dropdown.Header>{key}</Dropdown.Header>
                            {value.map((item) => (
                                <Dropdown.Item key={item.id}>
                                    <Link className='text-decoration-none'
                                        onClick={() => setShowMenu(false)} to={`/${key}/${item.id}`}>
                                        {key === 'drugs' ? item.drugName :
                                            key === 'orders' ? item.customer.fullName : item.fullName}
                                        <span className='fs-10'>{getRelatedWords(item)}</span>
                                    </Link>
                                </Dropdown.Item>
                            ))}
                        </div>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
}
