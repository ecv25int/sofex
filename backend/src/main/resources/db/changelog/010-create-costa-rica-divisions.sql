--liquibase formatted sql

--changeset admin:create-provinces-table
CREATE TABLE provinces (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

--changeset admin:create-cantons-table
CREATE TABLE cantons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    province_id BIGINT NOT NULL,
    FOREIGN KEY (province_id) REFERENCES provinces(id) ON DELETE CASCADE
);

--changeset admin:create-districts-table
CREATE TABLE districts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    canton_id BIGINT NOT NULL,
    FOREIGN KEY (canton_id) REFERENCES cantons(id) ON DELETE CASCADE
);

--changeset admin:insert-costa-rica-provinces
INSERT INTO provinces (name) VALUES 
('San José'),
('Alajuela'),
('Cartago'),
('Heredia'),
('Guanacaste'),
('Puntarenas'),
('Limón');

--changeset admin:insert-costa-rica-cantons
-- San José Province Cantons
INSERT INTO cantons (name, province_id) VALUES 
('San José', 1),
('Escazú', 1),
('Desamparados', 1),
('Puriscal', 1),
('Tarrazú', 1),
('Aserrí', 1),
('Mora', 1),
('Goicoechea', 1),
('Santa Ana', 1),
('Alajuelita', 1),
('Vázquez de Coronado', 1),
('Acosta', 1),
('Tibás', 1),
('Moravia', 1),
('Montes de Oca', 1),
('Turrubares', 1),
('Dota', 1),
('Curridabat', 1),
('Pérez Zeledón', 1),
('León Cortés Castro', 1);

-- Alajuela Province Cantons
INSERT INTO cantons (name, province_id) VALUES 
('Alajuela', 2),
('San Ramón', 2),
('Grecia', 2),
('San Mateo', 2),
('Atenas', 2),
('Naranjo', 2),
('Palmares', 2),
('Poás', 2),
('Orotina', 2),
('San Carlos', 2),
('Zarcero', 2),
('Valverde Vega', 2),
('Upala', 2),
('Los Chiles', 2),
('Guatuso', 2);

-- Cartago Province Cantons
INSERT INTO cantons (name, province_id) VALUES 
('Cartago', 3),
('Paraíso', 3),
('La Unión', 3),
('Jiménez', 3),
('Turrialba', 3),
('Alvarado', 3),
('Oreamuno', 3),
('El Guarco', 3);

-- Heredia Province Cantons
INSERT INTO cantons (name, province_id) VALUES 
('Heredia', 4),
('Barva', 4),
('Santo Domingo', 4),
('Santa Bárbara', 4),
('San Rafael', 4),
('San Isidro', 4),
('Belén', 4),
('Flores', 4),
('San Pablo', 4),
('Sarapiquí', 4);

-- Guanacaste Province Cantons
INSERT INTO cantons (name, province_id) VALUES 
('Liberia', 5),
('Nicoya', 5),
('Santa Cruz', 5),
('Bagaces', 5),
('Carrillo', 5),
('Cañas', 5),
('Abangares', 5),
('Tilarán', 5),
('Nandayure', 5),
('La Cruz', 5),
('Hojancha', 5);

-- Puntarenas Province Cantons
INSERT INTO cantons (name, province_id) VALUES 
('Puntarenas', 6),
('Esparza', 6),
('Buenos Aires', 6),
('Montes de Oro', 6),
('Osa', 6),
('Quepos', 6),
('Golfito', 6),
('Coto Brus', 6),
('Parrita', 6),
('Corredores', 6),
('Garabito', 6);

-- Limón Province Cantons
INSERT INTO cantons (name, province_id) VALUES 
('Limón', 7),
('Pococí', 7),
('Siquirres', 7),
('Talamanca', 7),
('Matina', 7),
('Guácimo', 7);

--changeset admin:insert-all-districts
-- COMPLETE DISTRICTS FOR ALL CANTONS IN COSTA RICA

-- San José Province Districts

-- San José canton (ID: 1)
INSERT INTO districts (name, canton_id) VALUES 
('Carmen', 1),
('Merced', 1),
('Hospital', 1),
('Catedral', 1),
('Zapote', 1),
('San Francisco de Dos Ríos', 1),
('La Uruca', 1),
('Mata Redonda', 1),
('Pavas', 1),
('Hatillo', 1),
('San Sebastián', 1);

-- Escazú canton (ID: 2)
INSERT INTO districts (name, canton_id) VALUES 
('Escazú', 2),
('San Antonio', 2),
('San Rafael', 2);

-- Desamparados canton (ID: 3)
INSERT INTO districts (name, canton_id) VALUES 
('Desamparados', 3),
('San Miguel', 3),
('San Juan de Dios', 3),
('San Rafael Arriba', 3),
('San Antonio', 3),
('Frailes', 3),
('Patarrá', 3),
('San Cristóbal', 3),
('Rosario', 3),
('Damas', 3),
('San Rafael Abajo', 3),
('Gravilias', 3),
('Los Guido', 3);

-- Puriscal canton (ID: 4)
INSERT INTO districts (name, canton_id) VALUES 
('Santiago', 4),
('Mercedes Sur', 4),
('Barbacoas', 4),
('Grifo Alto', 4),
('San Rafael', 4),
('Candelarita', 4),
('Desamparaditos', 4),
('San Antonio', 4),
('Chires', 4);

-- Tarrazú canton (ID: 5)
INSERT INTO districts (name, canton_id) VALUES 
('San Marcos', 5),
('San Lorenzo', 5),
('San Carlos', 5);

-- Aserrí canton (ID: 6)
INSERT INTO districts (name, canton_id) VALUES 
('Aserrí', 6),
('Tarbaca', 6),
('Vuelta de Jorco', 6),
('San Gabriel', 6),
('Legua', 6),
('Monterrey', 6),
('Salitrillos', 6);

-- Mora canton (ID: 7)
INSERT INTO districts (name, canton_id) VALUES 
('Colón', 7),
('Guayabo', 7),
('Tabarcia', 7),
('Piedras Negras', 7),
('Picagres', 7),
('Jaris', 7),
('Quitirrisí', 7);

-- Goicoechea canton (ID: 8)
INSERT INTO districts (name, canton_id) VALUES 
('Guadalupe', 8),
('San Francisco', 8),
('Calle Blancos', 8),
('Mata de Plátano', 8),
('Ipís', 8),
('Rancho Redondo', 8),
('Purral', 8);

-- Santa Ana canton (ID: 9)
INSERT INTO districts (name, canton_id) VALUES 
('Santa Ana', 9),
('Salitral', 9),
('Pozos', 9),
('Uruca', 9),
('Piedades', 9),
('Brasil', 9);

-- Alajuelita canton (ID: 10)
INSERT INTO districts (name, canton_id) VALUES 
('Alajuelita', 10),
('San Josecito', 10),
('San Antonio', 10),
('Concepción', 10),
('San Felipe', 10);

-- Vázquez de Coronado canton (ID: 11)
INSERT INTO districts (name, canton_id) VALUES 
('San Isidro', 11),
('San Rafael', 11),
('Dulce Nombre de Jesús', 11),
('Patalillo', 11),
('Cascajal', 11);

-- Acosta canton (ID: 12)
INSERT INTO districts (name, canton_id) VALUES 
('San Ignacio', 12),
('Guaitil', 12),
('Palmichal', 12),
('Cangrejal', 12),
('Sabanillas', 12);

-- Tibás canton (ID: 13)
INSERT INTO districts (name, canton_id) VALUES 
('San Juan', 13),
('Cinco Esquinas', 13),
('Anselmo Llorente', 13),
('León XIII', 13),
('Colima', 13);

-- Moravia canton (ID: 14)
INSERT INTO districts (name, canton_id) VALUES 
('San Vicente', 14),
('San Jerónimo', 14),
('La Trinidad', 14);

-- Montes de Oca canton (ID: 15)
INSERT INTO districts (name, canton_id) VALUES 
('San Pedro', 15),
('Sabanilla', 15),
('Mercedes', 15),
('San Rafael', 15);

-- Turrubares canton (ID: 16)
INSERT INTO districts (name, canton_id) VALUES 
('San Pablo', 16),
('San Pedro', 16),
('San Juan de Mata', 16),
('San Luis', 16),
('Carara', 16);

-- Dota canton (ID: 17)
INSERT INTO districts (name, canton_id) VALUES 
('Santa María', 17),
('Jardín', 17),
('Copey', 17);

-- Curridabat canton (ID: 18)
INSERT INTO districts (name, canton_id) VALUES 
('Curridabat', 18),
('Granadilla', 18),
('Sánchez', 18),
('Tirrases', 18);

-- Pérez Zeledón canton (ID: 19)
INSERT INTO districts (name, canton_id) VALUES 
('San Isidro de El General', 19),
('El General', 19),
('Daniel Flores', 19),
('Rivas', 19),
('San Pedro', 19),
('Platanares', 19),
('Pejibaye', 19),
('Cajón', 19),
('Barú', 19),
('Río Nuevo', 19),
('Páramo', 19),
('La Amistad', 19);

-- León Cortés Castro canton (ID: 20)
INSERT INTO districts (name, canton_id) VALUES 
('San Pablo', 20),
('San Andrés', 20),
('Llano Bonito', 20),
('San Isidro', 20),
('Santa Cruz', 20),
('San Antonio', 20);

-- Alajuela Province Districts

-- Alajuela canton (ID: 21)
INSERT INTO districts (name, canton_id) VALUES 
('Alajuela', 21),
('San José', 21),
('Carrizal', 21),
('San Antonio', 21),
('Guácima', 21),
('San Isidro', 21),
('Sabanilla', 21),
('San Rafael', 21),
('Río Segundo', 21),
('Desamparados', 21),
('Turrúcares', 21),
('Tambor', 21),
('Garita', 21),
('Sarapiquí', 21);

-- San Ramón canton (ID: 22)
INSERT INTO districts (name, canton_id) VALUES 
('San Ramón', 22),
('Santiago', 22),
('San Juan', 22),
('Piedades Norte', 22),
('Piedades Sur', 22),
('San Rafael', 22),
('San Isidro', 22),
('Ángeles', 22),
('Alfaro', 22),
('Volio', 22),
('Concepción', 22),
('Zapotal', 22),
('Peñas Blancas', 22),
('San Lorenzo', 22);

-- Grecia canton (ID: 23)
INSERT INTO districts (name, canton_id) VALUES 
('Grecia', 23),
('San Isidro', 23),
('San José', 23),
('San Roque', 23),
('Tacares', 23),
('Río Cuarto', 23),
('Puente de Piedra', 23),
('Bolívar', 23);

-- San Mateo canton (ID: 24)
INSERT INTO districts (name, canton_id) VALUES 
('San Mateo', 24),
('Desmonte', 24),
('Jesús María', 24),
('Labrador', 24);

-- Atenas canton (ID: 25)
INSERT INTO districts (name, canton_id) VALUES 
('Atenas', 25),
('Jesús', 25),
('Mercedes', 25),
('San Isidro', 25),
('Concepción', 25),
('San José', 25),
('Santa Eulalia', 25),
('Escobal', 25);

-- Naranjo canton (ID: 26)
INSERT INTO districts (name, canton_id) VALUES 
('Naranjo', 26),
('San Miguel', 26),
('San José', 26),
('Cirrí Sur', 26),
('San Jerónimo', 26),
('San Juan', 26),
('El Rosario', 26),
('Palmitos', 26);

-- Palmares canton (ID: 27)
INSERT INTO districts (name, canton_id) VALUES 
('Palmares', 27),
('Zaragoza', 27),
('Buenos Aires', 27),
('Santiago', 27),
('Candelaria', 27),
('Esquipulas', 27),
('La Granja', 27);

-- Poás canton (ID: 28)
INSERT INTO districts (name, canton_id) VALUES 
('San Pedro', 28),
('San Juan', 28),
('San Rafael', 28),
('Carrillos', 28),
('Sabana Redonda', 28);

-- Orotina canton (ID: 29)
INSERT INTO districts (name, canton_id) VALUES 
('Orotina', 29),
('El Mastate', 29),
('Hacienda Vieja', 29),
('Coyolar', 29),
('La Ceiba', 29);

-- San Carlos canton (ID: 30)
INSERT INTO districts (name, canton_id) VALUES 
('Quesada', 30),
('Florencia', 30),
('Buenavista', 30),
('Aguas Zarcas', 30),
('Venecia', 30),
('Pital', 30),
('La Fortuna', 30),
('La Tigra', 30),
('La Palmera', 30),
('Venado', 30),
('Cutris', 30),
('Monterrey', 30),
('Pocosol', 30);

-- Zarcero canton (ID: 31)
INSERT INTO districts (name, canton_id) VALUES 
('Zarcero', 31),
('Laguna', 31),
('Tapesco', 31),
('Guadalupe', 31),
('Palmira', 31),
('Zapote', 31),
('Brisas', 31);

-- Valverde Vega canton (ID: 32)
INSERT INTO districts (name, canton_id) VALUES 
('Sarchí Norte', 32),
('Sarchí Sur', 32),
('Toro Amarillo', 32),
('San Pedro', 32),
('Rodríguez', 32);

-- Upala canton (ID: 33)
INSERT INTO districts (name, canton_id) VALUES 
('Upala', 33),
('Aguas Claras', 33),
('San José', 33),
('Bijagua', 33),
('Delicias', 33),
('Dos Ríos', 33),
('Yolillal', 33),
('Canalete', 33);

-- Los Chiles canton (ID: 34)
INSERT INTO districts (name, canton_id) VALUES 
('Los Chiles', 34),
('Caño Negro', 34),
('El Amparo', 34),
('San Jorge', 34);

-- Guatuso canton (ID: 35)
INSERT INTO districts (name, canton_id) VALUES 
('San Rafael', 35),
('Buenavista', 35),
('Cote', 35),
('Katira', 35);

-- Cartago Province Districts

-- Cartago canton (ID: 36)
INSERT INTO districts (name, canton_id) VALUES 
('Oriental', 36),
('Occidental', 36),
('Carmen', 36),
('San Nicolás', 36),
('Aguacaliente', 36),
('Guadalupe', 36),
('Corralillo', 36),
('Tierra Blanca', 36),
('Dulce Nombre', 36),
('Llano Grande', 36),
('Quebradilla', 36);

-- Paraíso canton (ID: 37)
INSERT INTO districts (name, canton_id) VALUES 
('Paraíso', 37),
('Santiago', 37),
('Orosi', 37),
('Cachí', 37),
('Llanos de Santa Lucía', 37),
('Birrisito', 37);

-- La Unión canton (ID: 38)
INSERT INTO districts (name, canton_id) VALUES 
('Tres Ríos', 38),
('San Diego', 38),
('San Juan', 38),
('San Rafael', 38),
('Concepción', 38),
('Dulce Nombre', 38),
('San Ramón', 38),
('Río Azul', 38);

-- Jiménez canton (ID: 39)
INSERT INTO districts (name, canton_id) VALUES 
('Juan Viñas', 39),
('Tucurrique', 39),
('Pejibaye', 39),
('La Victoria', 39);

-- Turrialba canton (ID: 40)
INSERT INTO districts (name, canton_id) VALUES 
('Turrialba', 40),
('La Suiza', 40),
('Peralta', 40),
('Santa Cruz', 40),
('Santa Teresita', 40),
('Pavones', 40),
('Tuis', 40),
('Tayutic', 40),
('Santa Rosa', 40),
('Tres Equis', 40),
('La Isabel', 40),
('Chirripó', 40);

-- Alvarado canton (ID: 41)
INSERT INTO districts (name, canton_id) VALUES 
('Pacayas', 41),
('Cervantes', 41),
('Capellades', 41);

-- Oreamuno canton (ID: 42)
INSERT INTO districts (name, canton_id) VALUES 
('San Rafael', 42),
('Cot', 42),
('Potrero Cerrado', 42),
('Cipreses', 42),
('Santa Rosa', 42);

-- El Guarco canton (ID: 43)
INSERT INTO districts (name, canton_id) VALUES 
('El Tejar', 43),
('San Isidro', 43),
('Tobosi', 43),
('Patio de Agua', 43);

-- Heredia Province Districts

-- Heredia canton (ID: 44)
INSERT INTO districts (name, canton_id) VALUES 
('Heredia', 44),
('Mercedes', 44),
('San Francisco', 44),
('Ulloa', 44),
('Varablanca', 44);

-- Barva canton (ID: 45)
INSERT INTO districts (name, canton_id) VALUES 
('Barva', 45),
('San Pedro', 45),
('San Pablo', 45),
('San Roque', 45),
('Santa Lucía', 45),
('San José de la Montaña', 45),
('Puente Salas', 45);

-- Santo Domingo canton (ID: 46)
INSERT INTO districts (name, canton_id) VALUES 
('Santo Domingo', 46),
('San Vicente', 46),
('San Miguel', 46),
('Paracito', 46),
('Santo Tomás', 46),
('Santa Rosa', 46),
('Tures', 46),
('Pará', 46);

-- Santa Bárbara canton (ID: 47)
INSERT INTO districts (name, canton_id) VALUES 
('Santa Bárbara', 47),
('San Pedro', 47),
('San Juan', 47),
('Jesús', 47),
('Santo Domingo', 47),
('Purabá', 47);

-- San Rafael canton (ID: 48)
INSERT INTO districts (name, canton_id) VALUES 
('San Rafael', 48),
('San Josecito', 48),
('Santiago', 48),
('Ángeles', 48),
('Concepción', 48);

-- San Isidro canton (ID: 49)
INSERT INTO districts (name, canton_id) VALUES 
('San Isidro', 49),
('San José', 49),
('Concepción', 49),
('San Francisco', 49);

-- Belén canton (ID: 50)
INSERT INTO districts (name, canton_id) VALUES 
('San Antonio', 50),
('La Ribera', 50),
('La Asunción', 50);

-- Flores canton (ID: 51)
INSERT INTO districts (name, canton_id) VALUES 
('San Joaquín', 51),
('Barrantes', 51),
('Llorente', 51);

-- San Pablo canton (ID: 52)
INSERT INTO districts (name, canton_id) VALUES 
('San Pablo', 52),
('Rincón de Sabanilla', 52);

-- Sarapiquí canton (ID: 53)
INSERT INTO districts (name, canton_id) VALUES 
('Puerto Viejo', 53),
('La Virgen', 53),
('Las Horquetas', 53),
('Llanuras del Gaspar', 53),
('Cureña', 53);

-- Guanacaste Province Districts

-- Liberia canton (ID: 54)
INSERT INTO districts (name, canton_id) VALUES 
('Liberia', 54),
('Cañas Dulces', 54),
('Mayorga', 54),
('Nacascolo', 54),
('Curubandé', 54);

-- Nicoya canton (ID: 55)
INSERT INTO districts (name, canton_id) VALUES 
('Nicoya', 55),
('Mansión', 55),
('San Antonio', 55),
('Quebrada Honda', 55),
('Sámara', 55),
('Nosara', 55),
('Belén de Nosarita', 55);

-- Santa Cruz canton (ID: 56)
INSERT INTO districts (name, canton_id) VALUES 
('Santa Cruz', 56),
('Bolsón', 56),
('Veintisiete de Abril', 56),
('Tempate', 56),
('Cartagena', 56),
('Cuajiniquil', 56),
('Diriá', 56),
('Cabo Velas', 56),
('Tamarindo', 56);

-- Bagaces canton (ID: 57)
INSERT INTO districts (name, canton_id) VALUES 
('Bagaces', 57),
('La Fortuna', 57),
('Mogote', 57),
('Río Naranjo', 57);

-- Carrillo canton (ID: 58)
INSERT INTO districts (name, canton_id) VALUES 
('Filadelfia', 58),
('Palmira', 58),
('Sardinal', 58),
('Belén', 58);

-- Cañas canton (ID: 59)
INSERT INTO districts (name, canton_id) VALUES 
('Cañas', 59),
('Palmira', 59),
('San Miguel', 59),
('Bebedero', 59),
('Porozal', 59);

-- Abangares canton (ID: 60)
INSERT INTO districts (name, canton_id) VALUES 
('Las Juntas', 60),
('Sierra', 60),
('San Juan', 60),
('Colorado', 60);

-- Tilarán canton (ID: 61)
INSERT INTO districts (name, canton_id) VALUES 
('Tilarán', 61),
('Quebrada Grande', 61),
('Tronadora', 61),
('Santa Rosa', 61),
('Líbano', 61),
('Tierras Morenas', 61),
('Arenal', 61),
('Cabeceras', 61);

-- Nandayure canton (ID: 62)
INSERT INTO districts (name, canton_id) VALUES 
('Carmona', 62),
('Santa Rita', 62),
('Zapotal', 62),
('San Pablo', 62),
('Porvenir', 62),
('Bejuco', 62);

-- La Cruz canton (ID: 63)
INSERT INTO districts (name, canton_id) VALUES 
('La Cruz', 63),
('Santa Cecilia', 63),
('La Garita', 63),
('Santa Elena', 63);

-- Hojancha canton (ID: 64)
INSERT INTO districts (name, canton_id) VALUES 
('Hojancha', 64),
('Monte Romo', 64),
('Puerto Carrillo', 64),
('Huacas', 64),
('Matambú', 64);

-- Puntarenas Province Districts

-- Puntarenas canton (ID: 65)
INSERT INTO districts (name, canton_id) VALUES 
('Puntarenas', 65),
('Pitahaya', 65),
('Chomes', 65),
('Lepanto', 65),
('Paquera', 65),
('Manzanillo', 65),
('Guacimal', 65),
('Barranca', 65),
('Isla del Coco', 65),
('Cóbano', 65),
('Chacarita', 65),
('Chira', 65),
('Acapulco', 65),
('El Roble', 65),
('Arancibia', 65);

-- Esparza canton (ID: 66)
INSERT INTO districts (name, canton_id) VALUES 
('Espíritu Santo', 66),
('San Juan Grande', 66),
('Macacona', 66),
('San Rafael', 66),
('San Jerónimo', 66),
('Caldera', 66);

-- Buenos Aires canton (ID: 67)
INSERT INTO districts (name, canton_id) VALUES 
('Buenos Aires', 67),
('Volcán', 67),
('Potrero Grande', 67),
('Boruca', 67),
('Pilas', 67),
('Colinas', 67),
('Chánguena', 67),
('Biolley', 67),
('Brunka', 67);

-- Montes de Oro canton (ID: 68)
INSERT INTO districts (name, canton_id) VALUES 
('Miramar', 68),
('La Unión', 68),
('San Isidro', 68);

-- Osa canton (ID: 69)
INSERT INTO districts (name, canton_id) VALUES 
('Puerto Cortés', 69),
('Palmar', 69),
('Sierpe', 69),
('Bahía Ballena', 69),
('Piedras Blancas', 69),
('Bahía Drake', 69);

-- Quepos canton (ID: 70)
INSERT INTO districts (name, canton_id) VALUES 
('Quepos', 70),
('Savegre', 70),
('Naranjito', 70);

-- Golfito canton (ID: 71)
INSERT INTO districts (name, canton_id) VALUES 
('Golfito', 71),
('Guaycará', 71),
('Pavón', 71);

-- Coto Brus canton (ID: 72)
INSERT INTO districts (name, canton_id) VALUES 
('San Vito', 72),
('Sabalito', 72),
('Aguabuena', 72),
('Limoncito', 72),
('Pittier', 72),
('Gutiérrez Braun', 72);

-- Parrita canton (ID: 73)
INSERT INTO districts (name, canton_id) VALUES 
('Parrita', 73);

-- Corredores canton (ID: 74)
INSERT INTO districts (name, canton_id) VALUES 
('Corredor', 74),
('La Cuesta', 74),
('Canoas', 74),
('Laurel', 74);

-- Garabito canton (ID: 75)
INSERT INTO districts (name, canton_id) VALUES 
('Jacó', 75),
('Tárcoles', 75);

-- Limón Province Districts

-- Limón canton (ID: 76)
INSERT INTO districts (name, canton_id) VALUES 
('Limón', 76),
('Valle La Estrella', 76),
('Río Blanco', 76),
('Matama', 76);

-- Pococí canton (ID: 77)
INSERT INTO districts (name, canton_id) VALUES 
('Guápiles', 77),
('Jiménez', 77),
('Rita', 77),
('Roxana', 77),
('Cariari', 77),
('Colorado', 77),
('La Colonia', 77);

-- Siquirres canton (ID: 78)
INSERT INTO districts (name, canton_id) VALUES 
('Siquirres', 78),
('Pacuarito', 78),
('Florida', 78),
('Germania', 78),
('El Cairo', 78),
('Alegría', 78),
('Reventazón', 78);

-- Talamanca canton (ID: 79)
INSERT INTO districts (name, canton_id) VALUES 
('Bratsi', 79),
('Sixaola', 79),
('Cahuita', 79),
('Telire', 79);

-- Matina canton (ID: 80)
INSERT INTO districts (name, canton_id) VALUES 
('Matina', 80),
('Batán', 80),
('Carrandi', 80);

-- Guácimo canton (ID: 81)
INSERT INTO districts (name, canton_id) VALUES 
('Guácimo', 81),
('Mercedes', 81),
('Pocora', 81),
('Río Jiménez', 81),
('Duacarí', 81);
