import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import { createNote } from "../../services/noteService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NoteTag } from "../../types/note";

interface NoteFormProps {
  onClose: () => void;
}
interface FormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Min 3 characters")
    .max(50, "Max 50 characters")
    .required("Required"),

  content: Yup.string().max(500, "Max 500 characters"),

  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Required"),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
  });

  return (
    <Formik<FormValues>
      initialValues={{
        title: "",
        content: "",
        tag: "Todo",
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        mutation.mutate(values);
      }}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label>Title</label>
          <Field name="title" />
          <ErrorMessage name="title" component="span" />
        </div>

        <div className={css.formGroup}>
          <label>Content</label>
          <Field as="textarea" name="content" />
          <ErrorMessage name="content" component="span" />
        </div>

        <div className={css.formGroup}>
          <label>Tag</label>
          <Field as="select" name="tag">
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" />
        </div>
        <div className={css.actions}>
          <button type="button" onClick={onClose}>
            Cancel
          </button>

          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Creating..." : "Create note"}
          </button>
        </div>
      </Form>
    </Formik>
  );
}
