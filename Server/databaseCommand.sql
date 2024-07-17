danh sách các file tạo trong postgres


// tạo bảng lưu thông tin người dùng 
CREATE TABLE user_table ( 
	num serial PRIMARY KEY,
	account VARCHAR ( 50 ) UNIQUE NOT NULL,
	password VARCHAR ( 50 ) NOT NULL,
    name VARCHAR (50) NOT NULL,
    address json[5] NOT NULL,
    num_Adr smallint,
    IDdevice VARCHAR(50)
);

// tao bang luu thong tin thiet bi
CREATE TABLE device_table(
    num serial PRIMARY KEY,
    IDdevice VARCHAR(50) NOT NULL,
    status smallint,
    location VARCHAR(255),
    address text[]
);


// bảng lưu lịch su
CREATE TABLE history_table ( 
    num SERIAL PRIMARY KEY,
    action smallint NOT NULL,
    send VARCHAR(50) NOT NULL,
    get VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    id_event VARCHAR(5),
    time_happen VARCHAR(30)
);
CREATE TABLE session_table(
    code VARCHAR(30),
    account VARCHAR(50)
);

CREATE TABLE id_table(
    id_event smallint,
    loc smallint
);