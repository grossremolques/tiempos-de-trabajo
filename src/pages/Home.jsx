import { Form, Row, Col, Table, Button, InputGroup } from "react-bootstrap/";
import { useForm, useFieldArray } from "react-hook-form";
import { useGlobal } from "../context/Global/GlobalContext";
import { useEffect, useState } from "react";
import TextWarningForm from "../components/TextWarningForm";
import { ModalComponent } from "../components/ModalComponent";
import LoadingIcon from "../components/LoaderIcon";
export default function Home() {
  const [subsectores, setSubsectores] = useState([]);
  const {
    orders,
    getOrders,
    sectors,
    getSectors,
    empleados,
    getEmpleados,
    postTasks,
    handleModalShow,
  } = useGlobal();
  useEffect(() => {
    getOrders();
    getSectors();
    getEmpleados();
  }, []);
  const size = "sm";
  const STORAGE_KEY = "form-data";
  const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    tasks: [
      {
        tipo_orden: "",
        nro: "",
        cod_tarea: "",
        inicio: "07:00",
        fin: "",
        subsector: "",
        desvio: "",
        cant_pieza: "",
        reproceso: false,
      },
    ],
  };
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    defaultValues: savedData,
  });
  useEffect(() => {
    // Solo aplicar valores del localStorage si las opciones ya están disponibles
    if (
      empleados.length > 0 &&
      sectors.produccion.length > 0 &&
      orders.length > 0
    ) {
      Object.keys(savedData).forEach((key) => {
        setValue(key, savedData[key]);
        if (key === "tasks") {
          fields.forEach((item, index) => {
            setValue(
              `tasks.${index}.subsector`,
              savedData.tasks[index].subsector
            );
            setValue(
              `tasks.${index}.tipo_orden`,
              savedData.tasks[index].tipo_orden
            );
          });
        }
      });
    }
  }, [empleados, sectors.produccion, orders, setValue]);
  const watchedValues = watch();
  //Guarda las actualizaciones en el localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchedValues))
  }, [watchedValues]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tasks",
  });
  useEffect(() => {
    // Actualizar los subsectores basados en el sector inicial cargad
    const currentSector = watch("sector");
    if (currentSector) {
      const filteredSubsectores = sectors.data.filter(
        (item) => item.sector === currentSector
      );
      setSubsectores(filteredSubsectores);
    }
  }, [watch("sector"), sectors.data]);

  const onSubmit = async (data) => {
    handleModalShow("modal-loading");
    const res = await postTasks(data);
    if (res.some((item) => item === undefined)) {
      handleModalShow("modal-error");
    } else {
      localStorage.removeItem(STORAGE_KEY);
      reset({
        alias: '',
        sector: '',
        tasks: [
          {
            tipo_orden: "",
            nro: "",
            cod_tarea: "",
            inicio: "07:00",
            fin: "",
            subsector: "",
            desvio: "",
            cant_pieza: "",
            reproceso: false,
          },
        ],
      });
      handleModalShow("modal-success");
    }
  };
  const onError = (errors) => {
    console.error("Form errors:", errors);
  };
  const handleAddRows = () => {
    const num = watch('numFilas');
    for (let i = 0; i < num; i++) {
      append("tasks", {
        tipo_orden: "",
        nro: "",
        cod_tarea: "",
        inicio: "07:00",
        fin: "",
        subsector: "",
        desvio: "",
        cant_pieza: "",
        reproceso: false,
      });

    }
  }
  return (
    <>
      <Form className="mt-5" onSubmit={handleSubmit(onSubmit, onError)}>
        <Row className="g-1">
          <Form.Group className="mb-3" as={Col} sm={2}>
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              {...register("fecha", {
                required: {
                  value: true,
                  message: "Debe ingresar la fecha de las actividades",
                },
              })}
            />
            {errors.fecha && <TextWarningForm message={errors.fecha.message} />}
          </Form.Group>
          <Form.Group className="mb-3" as={Col}>
            <Form.Label>Operario</Form.Label>
            <Form.Select
              {...register("alias", {
                required: {
                  value: true,
                  message: "Seleccione un Operario",
                },
              })}
            >
              <option value=""></option>
              {empleados.map((item, index) => {
                return (
                  <option key={`${item.alia}-${index}`} value={item.alias}>
                    {`${item.nombre} ${item.apellido}`}
                  </option>
                );
              })}
            </Form.Select>
            {errors.alias && <TextWarningForm message={errors.alias.message} />}
          </Form.Group>
          <Form.Group className="mb-3" as={Col} sm={"auto"}>
            <Form.Label>Sector</Form.Label>
            <Form.Select
              {...register("sector", {
                required: {
                  value: true,
                  message: "Seleccione un Sector",
                },
                onChange: () => {
                  setSubsectores(
                    sectors.data.filter(
                      (item) => item.sector === watch("sector")
                    )
                  );
                },
              })}
            >
              <option value=""></option>
              {sectors.produccion.map((item) => {
                return (
                  <option key={item} value={item}>
                    {item}
                  </option>
                );
              })}
            </Form.Select>
            {errors.sector && (
              <TextWarningForm message={errors.sector.message} />
            )}
          </Form.Group>
        </Row>
        <hr />
        <Row className="g-1">
          <Col sm={3}>
            <h3>Tiempos de trabajo</h3>
          </Col>
          <Col sm={'2'} className="offset-7">
          <InputGroup>
        <Form.Control
          placeholder="Filas"
          type="number"
          {...register('numFilas')}
        />
        <Button variant="outline-secondary" onClick={handleAddRows}>
        {" "}
        Agregar <i className="bi bi-plus-lg"></i>
        </Button>
      </InputGroup>
          </Col>
          {/*<div className="d-flex justify-content-between">
            <h3>Tiempos de trabajo</h3>
            <Form.Control
              size={size}
              type="text"
              placeholder="jo"
            />
             <button
              type="button"
              onClick={() => {
                append({
                  tipo_orden: "",
                  nro: "",
                  cod_tarea: "",
                  inicio: watch(`tasks.${fields.length - 1}.fin`),
                  fin: "",
                  subsector: "",
                  desvio: "",
                  cant_pieza: "",
                  reproceso: false,
                });
              }}
              className="btn btn-success"
            >
              {" "}
              Agregar <i className="bi bi-plus-lg"></i>
            </button> 
          </div>*/}

          <Table className="mt-3" size="sm">
            <thead>
              <tr>
                <th style={{ width: "auto" }}>Tipo Orden</th>
                <th style={{ width: "120px" }}>Nro. Orden</th>
                <th style={{ width: "98px" }}>Cod. Tarea</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Subsector</th>
                <th>Desvío</th>
                <th style={{ width: "90px" }}>Cant. Pza</th>
                <th>Reproceso</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {fields.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <Form.Select
                        size={size}
                        {...register(`tasks.${index}.tipo_orden`, {
                          required: true,
                          onChange: () => {
                            setValue(`tasks.${index}.nro`, "");
                            if (watch(`tasks.${index}.tipo_orden`) === "N/A") {
                              setValue(`tasks.${index}.nro`, "-");
                            }
                          },
                        })}
                      >
                        <option value=""></option>
                        {orders.map((item, index) => {
                          return (
                            <option key={index} value={item.abreviatura}>
                              {item.nombre}
                            </option>
                          );
                        })}
                      </Form.Select>
                    </td>
                    <td>
                      <Form.Control
                        size={size}
                        type="text"
                        {...register(`tasks.${index}.nro`, {
                          required: true,
                        })}
                      />
                    </td>
                    <td>
                      <Form.Control
                        size={size}
                        type="number"
                        {...register(`tasks.${index}.cod_tarea`, {
                          required: true,
                        })}
                      />
                    </td>
                    <td>
                      <Form.Control
                        size={size}
                        type="time"
                        {...register(`tasks.${index}.inicio`, {
                          required: true,
                        })}
                      />
                    </td>
                    <td>
                      <Form.Control
                        size={size}
                        type="time"
                        {...register(`tasks.${index}.fin`, {
                          required: true,
                          validate: (value) => {
                            return (
                              watch(`tasks.${index}.inicio`) != value ||
                              "No pueden ser iguales los tiempos de inico y fin"
                            );
                          },
                        })}
                      />
                    </td>
                    <td>
                      <Form.Select
                        size={size}
                        /* value={savedData.tasks[index]?.subsector} */
                        {...register(`tasks.${index}.subsector`, {
                          required: true,
                        })}
                      >
                        <option value=""></option>
                        {subsectores.map((item) => (
                          <option
                            key={`${item.subsector}`}
                            value={item.subsector}
                          >
                            {item.subsector}
                          </option>
                        ))}
                      </Form.Select>
                    </td>
                    <td>
                      <Form.Control
                        size={size}
                        type="text"
                        {...register(`tasks.${index}.desvio`, {
                        })}
                      />
                    </td>
                    <td>
                      <Form.Control
                        size={size}
                        type="number"
                        {...register(`tasks.${index}.cant_pieza`, {
                          required: true,
                        })}
                      />
                    </td>
                    <td>
                      <Form.Select
                        size={size}
                        {...register(`tasks.${index}.reproceso`, {
                          required: true,
                        })}
                      >
                        <option value={false}>No</option>
                        <option value={true}>Sí</option>
                      </Form.Select>
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => remove(index)}
                        tabIndex={-1}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          {errors.tasks && (
            <TextWarningForm message="Todos los campos son obligatorios" />
          )}
        </Row>
        <Row className="mt-3">
          <Col>
            <Button
              type="submit"
              {...register("form", {
                validate: () => {
                  return (
                    watch("tasks").length > 0 || "Debe agregar una actividad"
                  );
                },
              })}
            >
              Guardar
            </Button>
          </Col>
          {errors.form && <TextWarningForm message={errors.form.message} />}
        </Row>
      </Form>
      <ModalComponent
        modalId="modal-loading"
        title="Procesando"
        body={<LoadingIcon />}
        showButtonsClose={false}
      />
      <ModalComponent
        modalId="modal-error"
        title="Error"
        body={
          <div>
            <p>Hubo un error al guardar la orden.</p>
            <p>Por favor, intente nuevamente.</p>
          </div>
        }
        showButtonsClose={true}
      />
      <ModalComponent
        modalId="modal-success"
        title="Proceso exitoso"
        body={
          <div>
            <p>Se han guardado las horas exitosamente</p>
          </div>
        }
        showButtonsClose={true}
      />
    </>
  );
}
