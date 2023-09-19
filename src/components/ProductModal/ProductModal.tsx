import { Button, Form, Modal } from "react-bootstrap";
import { Product } from "../../types/Product";
import { ModalType } from "../../types/enum";
import * as Yup from "yup";
import { useFormik } from "formik";
import { ProductService } from "../../services/ProductService";

//Notificaciones al usuario
import { toast } from 'react-toastify';
import React from "react";


type ProductModalProps = {
    show: boolean;
    onHide: () => void;
    title: string
    modalType: ModalType;
    prod: Product;
    refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};



//YUP

const validationSchema = Yup.object().shape({
    id: Yup.number().integer().min(0),
    title: Yup.string().required('El titulo es requerido'),
    price: Yup.number().min(0).required('El precio es requerido'),
    description: Yup.string().required('La descripcion es requerida'),
    category: Yup.string().required('La categoria es requerida'),
    image: Yup.string().required('La URL de la imagen es requerida'),
  });

//Formik
const formik = useFormik({
    initialValues: prod,
    validationSchema: validationSchema(),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (obj: Product) => handleSaveUpdate(obj),
});

//Codificar función handleSaveUpdate (CREATE-UPDATE)

const handleSaveUpdate =async (pro:Product) => {
    try {
        const isNew = pro.id === 0;
        if (isNew) {
            await ProductService.createProduct(pro);
        } else {
            await ProductService.updateProduct(pro.id,pro);
        }
        toast.success(isNew ? "Producto Creado" : "Producto Actualizado", {
            position: "top-center",
        });
        onHide();
        refreshData(prevState => !prevState);
    } catch (error) {
        console.error(error);
        toast.error('Ha ocurrido un error');
    }
    
};

//Función handleDelete (DELETE)

const handleDelete =async () => {
    try {
        await ProductService.deteleProduct(prod.id);
        toast.success("Producto borrado", {
            position: "top-center",
        });
        onHide();
        refreshData(prevState => !prevState);
    } catch (error) {
        console.error(error);
        toast.error("Ha ocurrido un error");
        
    }
    
}


const ProductModal = ({show, onHide, title, modalType, prod, refreshData
    }:ProductModalProps) => {
        
        return(
            <>

            {modalType === ModalType.DELETE ? (
                <>

                <Modal show={show} onHide={onHide} centered backdrop="static"/>

                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p> ¿Está seguro que desea eliminar el producto  
                        <br /> <strong> {prod.title} </strong> ?
                    </p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancelar
                    </Button>

                    <Button variant="danger" onClick={handleDelete}>
                        Cancelar
                    </Button>
                </Modal.Footer>


                </>
            ) : (
                <>
                <Modal show={show} onHide={onHide} centered backdrop="static" className="modal-xl">
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                    <Form onSubmit={formik.handleSubmit}>
                        <Form.Group controlId="formTitulo">
                            <Form.Label>Titulo</Form.Label>
                            <Form.Control
                                name="title"
                                type="text"
                                value={formik.values.title || ''}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={Boolean(formik.errors.title &&
                                formik.touched.title)}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.title}
                             </Form.Control.Feedback>
                            </Form.Group>

                            <Modal.Footer className="mt-4">
                                
                                <Button variant="secondary" onClick={onHide}>
                                    Cancelar
                                </Button>
                                <Button variant="primary" type="submit" disabled={!formik.isValid}>
                                    Guardar
                                </Button>

                            </Modal.Footer>
                            </Form>
                               

                    </Modal.Body>

                </Modal>

            </>
        )}
        </>
    )

}

export default ProductModal;