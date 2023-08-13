import React from "react";

type Props = {
  dialogRef: React.MutableRefObject<HTMLDialogElement>;
  phoneState: PhoneState;
  resendCode: () => Promise<void>;
  verifyPhone: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

export function PhoneVerificationModal({ dialogRef, phoneState, resendCode, verifyPhone }: Props) {
  return (
    <dialog ref={dialogRef}>
      <section>
        <header>Verify your phone number</header>
        <main>
          {phoneState === "CODE_SENT" && (
            <blockquote>
              You should have received an SMS. Use the code to verify your phone number. Did not receive anything?
              Request a <u onClick={resendCode}>new code</u>.
            </blockquote>
          )}
          {phoneState === "CODE_EXPIRED" && (
            <blockquote className="error">
              You should have received an SMS. Use the code to verify your phone number.
            </blockquote>
          )}
          {phoneState === "INVALID_CODE" && (
            <blockquote className="error">
              This code is not valid. Try again or request a <u onClick={resendCode}>new code</u>.
            </blockquote>
          )}
          {phoneState === "LIMIT_EXCEEDED" && (
            <blockquote className="error">Attempt limit exceeded, please try after some time.</blockquote>
          )}
          <form onSubmit={verifyPhone}>
            <div>
              <label htmlFor="code">Verification code</label>
              <input type="text" name="code" id="code" required />
            </div>
            <div>
              <button type="reset" onClick={() => (dialogRef.current.open = false)}>
                Close
              </button>
              <input type="submit" value="Verify" />
            </div>
          </form>
        </main>
      </section>
    </dialog>
  );
}
