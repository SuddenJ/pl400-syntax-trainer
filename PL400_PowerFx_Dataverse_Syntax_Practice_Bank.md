# PL-400 Power Fx & Dataverse Syntax Practice Bank

**Total questions:** 260  
**Adapted from the uploaded study material (`DOC`):** 87  
**Added to fill syntax/coverage gaps (`GAP`):** 173

This bank is deliberately **short-answer and syntax-first**, rather than four-option multiple choice. It is designed to be easy to parse into a React practice page and to force recall of the actual function, class, interface, method, property, or code shape.

## How to use the tags

- `DOC` — extracted from or directly adapted from the uploaded PL-400 question bank / failed-question documents.
- `GAP` — added to complete the surrounding syntax surface using current Microsoft Learn guidance and the current PL-400 skills outline.

For a first pass in a practice app, consider weighting `DOC` questions more heavily because they directly reflect material already encountered. Use `GAP` questions to prevent memorising only the exact wording of previous questions.

## Uploaded material reviewed

1. `PL400_Audio_Question_Bank.md`
2. `Failed questions V1.docx`
3. `Failed questions V2.docx`
4. `Failed Questions 3.docx`
5. `failed questions 4.docx`

## Important current-version notes

1. **Named formulas:** true app-level named formulas belong in `App.Formulas`. `With(...)` creates local named values; `Set(...)` creates/updates mutable global state. They are related concepts, but they are not the same thing.
2. **Delegation:** never treat the absence of a delegation warning as proof that a formula delegates. In particular, `With`, `Set`, and `UpdateContext` can introduce in-memory state that does not participate in delegation.
3. **Dataverse client SDK:** `ServiceClient` is the preferred client implementation for new application development. `CrmServiceClient` is older and still appears in legacy material.
4. **Model-driven client scripting:** prefer `executionContext.getFormContext()` / `formContext`; `Xrm.Page` is deprecated.
5. **Dataverse low-code plug-ins:** this remains preview functionality. Current Microsoft documentation says **instant low-code plug-ins are deprioritized and are replaced by Functions in Microsoft Dataverse (preview)**. The bank therefore covers both the low-code plug-in concepts and the newer Dataverse Function syntax.

## Coverage

| Section | Questions |
|---|---:|
| Power Fx — Core syntax | 64 |
| Power Fx — Utility syntax | 30 |
| Power Fx — Delegation, commands, and performance | 22 |
| Dataverse Power Fx — functions and low-code server logic | 17 |
| Dataverse — Plug-in interfaces, classes, context, and SDK syntax | 68 |
| Dataverse SDK — custom APIs and supporting .NET types | 15 |
| Model-driven apps — Client API / Xrm syntax | 25 |
| PCF — interfaces and lifecycle syntax | 19 |
| **Total** | **260** |

## Question format for a React app

Every question has a stable ID, topic, origin tag, prompt, and a matching answer-key entry. A simple parser can split the file at `# Question Bank` and `# Answer Key`, then use the `### <ID>` headings as keys.

---

# Question Bank

## Power Fx — Core syntax

### PFX-CORE-001 — Control properties

**Origin:** `DOC`

**Prompt:** You have a dropdown that must display only active Dataverse absence types using `Filter('Absence Types', 'Absence Types (Views)'.'Active Absence Types')`. Which control property should contain the formula?

### PFX-CORE-002 — Filter

**Origin:** `GAP`

**Prompt:** Write a Power Fx formula that returns only active Accounts where `Status = "Active"`.

### PFX-CORE-003 — Filter

**Origin:** `GAP`

**Prompt:** Write a `Filter` that returns Orders where `Total > 1000` and `Status = "Open"`.

### PFX-CORE-004 — LookUp

**Origin:** `GAP`

**Prompt:** Write a formula that returns the first Account whose `AccountNumber` equals `"A100"`.

### PFX-CORE-005 — LookUp reduction

**Origin:** `GAP`

**Prompt:** Return only the `Name` value from the first Account whose `AccountNumber` is `"A100"`.

### PFX-CORE-006 — Search

**Origin:** `GAP`

**Prompt:** Search Accounts for the text in `txtSearch.Text` across the `Name` column.

### PFX-CORE-007 — Sort

**Origin:** `GAP`

**Prompt:** Sort Accounts by the `Name` formula in ascending order.

### PFX-CORE-008 — SortByColumns

**Origin:** `GAP`

**Prompt:** Sort Accounts by the `name` column descending.

### PFX-CORE-009 — First

**Origin:** `GAP`

**Prompt:** Return the first row from `Accounts`.

### PFX-CORE-010 — FirstN

**Origin:** `GAP`

**Prompt:** Return the first 10 rows from `Accounts`.

### PFX-CORE-011 — Last

**Origin:** `GAP`

**Prompt:** Return the last row from a local collection named `colOrders`.

### PFX-CORE-012 — LastN

**Origin:** `GAP`

**Prompt:** Return the last five rows from `colOrders`.

### PFX-CORE-013 — CountRows

**Origin:** `GAP`

**Prompt:** Return the number of records in `colOrders`.

### PFX-CORE-014 — Distinct

**Origin:** `GAP`

**Prompt:** Return a one-column table of unique `City` values from Accounts.

### PFX-CORE-015 — Choices

**Origin:** `DOC`

**Prompt:** Populate a combo box with possible values for the `Primary Contact` lookup on Accounts.

### PFX-CORE-016 — Patch update

**Origin:** `DOC`

**Prompt:** Update the selected Order's `Status` to `"Closed"`, locating the row by `OrderId = 42`.

### PFX-CORE-017 — Patch create

**Origin:** `DOC`

**Prompt:** Create a new Inventory row with `ProductName = "Camera"`.

### PFX-CORE-018 — Patch multiple fields

**Origin:** `GAP`

**Prompt:** Update the selected Account's Name and Credit Limit.

### PFX-CORE-019 — With + Patch

**Origin:** `GAP`

**Prompt:** Create an Order and then use the returned record's ID in a second expression without a global variable.

### PFX-CORE-020 — Collect

**Origin:** `GAP`

**Prompt:** Append a record to collection `colCart`.

### PFX-CORE-021 — Clear

**Origin:** `GAP`

**Prompt:** Remove all rows from the local collection `colCart`.

### PFX-CORE-022 — ClearCollect

**Origin:** `DOC`

**Prompt:** Replace all rows in `colAccounts` with the result of `Filter(Accounts, Status = "Active")`.

### PFX-CORE-023 — Remove

**Origin:** `DOC`

**Prompt:** Delete the selected record from a data source.

### PFX-CORE-024 — RemoveIf

**Origin:** `GAP`

**Prompt:** Delete all local collection rows whose `Quantity = 0`.

### PFX-CORE-025 — Update

**Origin:** `GAP`

**Prompt:** Replace a matching record in a local collection with a supplied record.

### PFX-CORE-026 — UpdateIf

**Origin:** `GAP`

**Prompt:** Change `Status` to `"Expired"` for every local row where `EndDate < Today()`.

### PFX-CORE-027 — Refresh

**Origin:** `GAP`

**Prompt:** Force the `Accounts` data source to retrieve fresh data.

### PFX-CORE-028 — Set

**Origin:** `GAP`

**Prompt:** Create/update a global variable named `varAccountId`.

### PFX-CORE-029 — UpdateContext

**Origin:** `GAP`

**Prompt:** Create/update a screen-scoped variable named `showDetails`.

### PFX-CORE-030 — Navigate context

**Origin:** `GAP`

**Prompt:** Navigate to `DetailsScreen` and pass a screen context variable `accountId`.

### PFX-CORE-031 — With

**Origin:** `DOC`

**Prompt:** Use `With` to calculate `price * quantity` while naming the intermediate values `p` and `q`.

### PFX-CORE-032 — Named formulas

**Origin:** `GAP`

**Prompt:** Where do true app-level named formulas live in a canvas app?

### PFX-CORE-033 — Named formulas

**Origin:** `GAP`

**Prompt:** Define an app named formula `TaxRate` with the value `0.15`.

### PFX-CORE-034 — Concurrent

**Origin:** `GAP`

**Prompt:** Load Accounts and Contacts into separate collections concurrently.

### PFX-CORE-035 — If

**Origin:** `GAP`

**Prompt:** Return `"High"` when `Total > 1000`, otherwise `"Normal"`.

### PFX-CORE-036 — Switch

**Origin:** `GAP`

**Prompt:** Map `Status` values 1, 2, and everything else to text.

### PFX-CORE-037 — Coalesce

**Origin:** `GAP`

**Prompt:** Return `Nickname` when present, otherwise `FullName`.

### PFX-CORE-038 — IsBlank

**Origin:** `GAP`

**Prompt:** Test whether `txtEmail.Text` is blank.

### PFX-CORE-039 — IsEmpty

**Origin:** `GAP`

**Prompt:** Test whether `colResults` contains no records.

### PFX-CORE-040 — IfError

**Origin:** `GAP`

**Prompt:** Patch an Account and show a notification if the operation fails.

### PFX-CORE-041 — Errors

**Origin:** `GAP`

**Prompt:** Return error records for the `Accounts` data source after a data operation.

### PFX-CORE-042 — Notify

**Origin:** `GAP`

**Prompt:** Show an error notification to the user.

### PFX-CORE-043 — ForAll

**Origin:** `GAP`

**Prompt:** For every row in `colSelected`, create a related Task record.

### PFX-CORE-044 — Sequence

**Origin:** `GAP`

**Prompt:** Generate the numbers 1 through 10 as a single-column table.

### PFX-CORE-045 — ThisRecord

**Origin:** `GAP`

**Prompt:** Inside a record-scope formula, how do you explicitly refer to the current record?

### PFX-CORE-046 — As operator

**Origin:** `GAP`

**Prompt:** Alias the Accounts record scope as `acct` in a `Filter`.

### PFX-CORE-047 — ThisItem

**Origin:** `GAP`

**Prompt:** Inside a gallery template, refer to the current row's Name.

### PFX-CORE-048 — Self

**Origin:** `DOC`

**Prompt:** Refer to the current control's `Text` property.

### PFX-CORE-049 — Parent

**Origin:** `GAP`

**Prompt:** Refer to the parent control's width.

### PFX-CORE-050 — SubmitForm

**Origin:** `GAP`

**Prompt:** Submit an Edit form named `EditForm1`.

### PFX-CORE-051 — ResetForm

**Origin:** `GAP`

**Prompt:** Discard unsaved changes in `EditForm1`.

### PFX-CORE-052 — NewForm

**Origin:** `GAP`

**Prompt:** Put `EditForm1` into create/new mode.

### PFX-CORE-053 — EditForm

**Origin:** `GAP`

**Prompt:** Put `EditForm1` into edit mode.

### PFX-CORE-054 — ViewForm

**Origin:** `GAP`

**Prompt:** Put `EditForm1` into view-only mode.

### PFX-CORE-055 — Reset

**Origin:** `GAP`

**Prompt:** Reset a text input named `txtSearch` back to its Default value.

### PFX-CORE-056 — Navigate

**Origin:** `GAP`

**Prompt:** Navigate to `DetailsScreen` with a fade transition.

### PFX-CORE-057 — Back

**Origin:** `GAP`

**Prompt:** Return to the previous screen.

### PFX-CORE-058 — Flow call

**Origin:** `DOC`

**Prompt:** Call a Power Automate flow named `GetCustomers` with two values.

### PFX-CORE-059 — AddColumns

**Origin:** `GAP`

**Prompt:** Add a calculated `FullName` column to Contacts.

### PFX-CORE-060 — ShowColumns

**Origin:** `GAP`

**Prompt:** Return only Name and AccountNumber from Accounts.

### PFX-CORE-061 — DropColumns

**Origin:** `GAP`

**Prompt:** Return Accounts without the `InternalNotes` column.

### PFX-CORE-062 — RenameColumns

**Origin:** `GAP`

**Prompt:** Rename a local table column `OldName` to `NewName`.

### PFX-CORE-063 — GroupBy

**Origin:** `GAP`

**Prompt:** Group a local table `colSales` by `Region`, storing grouped rows in `RegionRows`.

### PFX-CORE-064 — Ungroup

**Origin:** `GAP`

**Prompt:** Flatten a grouped table using the `RegionRows` nested-table column.

## Power Fx — Utility syntax

### PFX-UTIL-001 — Text

**Origin:** `GAP`

**Prompt:** Format `Total` as currency text using a format string.

### PFX-UTIL-002 — Value

**Origin:** `GAP`

**Prompt:** Convert `txtAmount.Text` to a number.

### PFX-UTIL-003 — Boolean

**Origin:** `GAP`

**Prompt:** Convert text/value input to a Boolean when supported.

### PFX-UTIL-004 — Today

**Origin:** `GAP`

**Prompt:** Return the current date without a time component.

### PFX-UTIL-005 — Now

**Origin:** `GAP`

**Prompt:** Return the current date and time.

### PFX-UTIL-006 — DateAdd

**Origin:** `GAP`

**Prompt:** Add 7 days to `StartDate`.

### PFX-UTIL-007 — DateDiff

**Origin:** `GAP`

**Prompt:** Return the number of days between `StartDate` and `EndDate`.

### PFX-UTIL-008 — Year Month Day

**Origin:** `GAP`

**Prompt:** Extract the year from `StartDate`.

### PFX-UTIL-009 — GUID

**Origin:** `GAP`

**Prompt:** Convert `txtId.Text` to a GUID value.

### PFX-UTIL-010 — Len

**Origin:** `GAP`

**Prompt:** Return the number of characters in `txtName.Text`.

### PFX-UTIL-011 — Left

**Origin:** `GAP`

**Prompt:** Return the first three characters of `Code`.

### PFX-UTIL-012 — Right

**Origin:** `GAP`

**Prompt:** Return the last four characters of `Code`.

### PFX-UTIL-013 — Mid

**Origin:** `GAP`

**Prompt:** Return five characters from `Code`, starting at character 3.

### PFX-UTIL-014 — TrimEnds

**Origin:** `GAP`

**Prompt:** Remove leading and trailing whitespace from a text value without intentionally collapsing internal spaces.

### PFX-UTIL-015 — Lower Upper

**Origin:** `GAP`

**Prompt:** Convert `Email` to lowercase.

### PFX-UTIL-016 — Concatenate

**Origin:** `GAP`

**Prompt:** Join `FirstName`, a space, and `LastName` using a function rather than `&`.

### PFX-UTIL-017 — Substitute

**Origin:** `DOC`

**Prompt:** Replace `"-"` with `"/"` in `Code`.

### PFX-UTIL-018 — Split

**Origin:** `DOC`

**Prompt:** Split a comma-separated `Tags` string into a single-column table.

### PFX-UTIL-019 — IsMatch

**Origin:** `GAP`

**Prompt:** Test whether `txtEmail.Text` matches an email pattern.

### PFX-UTIL-020 — Match

**Origin:** `GAP`

**Prompt:** Return the first regex match from a text string.

### PFX-UTIL-021 — Rand

**Origin:** `GAP`

**Prompt:** Return a random decimal between 0 and 1.

### PFX-UTIL-022 — RandBetween

**Origin:** `GAP`

**Prompt:** Return a random integer from 1 through 10.

### PFX-UTIL-023 — Round

**Origin:** `GAP`

**Prompt:** Round `Amount` to two decimal places.

### PFX-UTIL-024 — Max Min

**Origin:** `GAP`

**Prompt:** Return the maximum value of the `Total` column in `Orders`.

### PFX-UTIL-025 — Sum

**Origin:** `GAP`

**Prompt:** Return the sum of the `Total` column in `Orders`.

### PFX-UTIL-026 — Average

**Origin:** `GAP`

**Prompt:** Return the average of the `Score` column in `colScores`.

### PFX-UTIL-027 — User

**Origin:** `GAP`

**Prompt:** Return information about the current Power Apps user.

### PFX-UTIL-028 — Param

**Origin:** `GAP`

**Prompt:** Read an app launch parameter named `AccountId`.

### PFX-UTIL-029 — Blank

**Origin:** `GAP`

**Prompt:** Return a blank value explicitly.

### PFX-UTIL-030 — IsError

**Origin:** `GAP`

**Prompt:** Test whether an expression/value is an error.

## Power Fx — Delegation, commands, and performance

### PFX-DEL-001 — Delegation

**Origin:** `GAP`

**Prompt:** What does delegation mean in a canvas app?

### PFX-DEL-002 — Delegation

**Origin:** `DOC`

**Prompt:** If any part of a query expression is nondelegable, what happens to that query?

### PFX-DEL-003 — Nondelegable limit

**Origin:** `DOC`

**Prompt:** What is the default local row limit for a nondelegable query?

### PFX-DEL-004 — Nondelegable limit

**Origin:** `DOC`

**Prompt:** What is the documented maximum canvas-app data row limit for nondelegable queries?

### PFX-DEL-005 — Delegation testing

**Origin:** `DOC`

**Prompt:** What temporary Data row limit makes hidden nondelegation easiest to detect in testing?

### PFX-DEL-006 — With delegation

**Origin:** `DOC`

**Prompt:** Why can a `With` around a large remote query be dangerous even when no delegation warning appears?

### PFX-DEL-007 — Set delegation

**Origin:** `DOC`

**Prompt:** Does putting remote query results into `Set(...)` make the query delegable?

### PFX-DEL-008 — UpdateContext delegation

**Origin:** `DOC`

**Prompt:** Does `UpdateContext(...)` participate in delegation?

### PFX-DEL-009 — Filter delegation

**Origin:** `GAP`

**Prompt:** Is `Filter` always delegable?

### PFX-DEL-010 — Sort delegation

**Origin:** `DOC`

**Prompt:** When can `Sort` delegate?

### PFX-DEL-011 — Search delegation

**Origin:** `GAP`

**Prompt:** Should you assume `Search` delegates against Dataverse in every host/context?

### PFX-DEL-012 — FirstN delegation

**Origin:** `GAP`

**Prompt:** Should `FirstN` be used to 'fix' a large nondelegable query?

### PFX-DEL-013 — Lookup expansion

**Origin:** `GAP`

**Prompt:** How many lookup/expand levels does the canvas-app delegation guidance allow in a query expression?

### PFX-DEL-014 — Lookup joins

**Origin:** `GAP`

**Prompt:** What is the documented maximum number of entities that can be expanded/joined in a single Power Fx query?

### PFX-DEL-015 — Delegation LHS

**Origin:** `GAP`

**Prompt:** For delegable equality comparisons, where should the entity property generally appear?

### PFX-DEL-016 — Command visibility

**Origin:** `DOC`

**Prompt:** A model-driven command must be visible only when at least one grid row is selected. Write the expression.

### PFX-DEL-017 — Command selection

**Origin:** `DOC`

**Prompt:** Which command property represents all selected grid rows?

### PFX-DEL-018 — Command selection

**Origin:** `DOC`

**Prompt:** What happens to `Self.Selected.Item` when the selection maximum is not 1?

### PFX-DEL-019 — Command Power Fx

**Origin:** `DOC`

**Prompt:** Can every canvas-app Power Fx function be used in model-driven commanding?

### PFX-DEL-020 — Performance

**Origin:** `DOC`

**Prompt:** Live Monitor shows the same Dataverse table fetched repeatedly during one screen load. What pattern does Microsoft recommend considering?

### PFX-DEL-021 — Concurrent dependencies

**Origin:** `GAP`

**Prompt:** Can one sibling argument inside `Concurrent(...)` safely depend on the result of another sibling argument?

### PFX-DEL-022 — Concurrent scope

**Origin:** `GAP`

**Prompt:** Where can `Concurrent` be used?

## Dataverse Power Fx — functions and low-code server logic

### DV-PFX-001 — current status

**Origin:** `GAP`

**Prompt:** What is the current status you should remember for Dataverse low-code plug-ins?

### DV-PFX-002 — instant plug-ins

**Origin:** `GAP`

**Prompt:** What current Microsoft guidance applies specifically to **instant** low-code plug-ins?

### DV-PFX-003 — Dataverse Functions

**Origin:** `GAP`

**Prompt:** What language is used to author a Dataverse Function?

### DV-PFX-004 — Dataverse Functions parameters

**Origin:** `GAP`

**Prompt:** How are Dataverse Function input parameters referenced inside the formula?

### DV-PFX-005 — Dataverse Functions outputs

**Origin:** `GAP`

**Prompt:** A Dataverse Function has an output parameter named `Out`. What is the required output-record syntax?

### DV-PFX-006 — Dataverse Functions tables

**Origin:** `GAP`

**Prompt:** Which familiar Power Fx functions can query table references inside a Dataverse Function?

### DV-PFX-007 — low-code plug-in scope

**Origin:** `GAP`

**Prompt:** What two scopes can an instant low-code plug-in use?

### DV-PFX-008 — instant parameters

**Origin:** `GAP`

**Prompt:** Which low-code plug-in type supports custom input and output parameters?

### DV-PFX-009 — automated plug-ins

**Origin:** `GAP`

**Prompt:** Which Dataverse operations can automated low-code plug-ins respond to?

### DV-PFX-010 — automated context

**Origin:** `GAP`

**Prompt:** Which Power Fx record-scope keyword represents the row being processed in an automated low-code plug-in?

### DV-PFX-011 — table disambiguation

**Origin:** `GAP`

**Prompt:** When a Dataverse table name conflicts with record scope, what explicit table notation can disambiguate it?

### DV-PFX-012 — server-side

**Origin:** `GAP`

**Prompt:** Where does Dataverse low-code plug-in / Function Power Fx execute?

### DV-PFX-013 — unsupported functions

**Origin:** `GAP`

**Prompt:** Should you assume every canvas-app Power Fx function is available inside a low-code plug-in?

### DV-PFX-014 — Defaults limitation

**Origin:** `GAP`

**Prompt:** Can you rely on `Defaults()` inside a Dataverse low-code plug-in?

### DV-PFX-015 — Concurrent limitation

**Origin:** `GAP`

**Prompt:** Is `Concurrent()` supported in Dataverse low-code plug-ins?

### DV-PFX-016 — Search limitation

**Origin:** `GAP`

**Prompt:** Is `Search()` supported in Dataverse low-code plug-ins?

### DV-PFX-017 — Choices limitation

**Origin:** `GAP`

**Prompt:** Is `Choices()` supported in Dataverse low-code plug-ins?

## Dataverse — Plug-in interfaces, classes, context, and SDK syntax

### DV-PLUGIN-001 — IPlugin

**Origin:** `GAP`

**Prompt:** Which interface must a traditional Dataverse plug-in class implement?

### DV-PLUGIN-002 — IPlugin.Execute

**Origin:** `DOC`

**Prompt:** What is the standard plug-in entry-point signature?

### DV-PLUGIN-003 — IServiceProvider

**Origin:** `DOC`

**Prompt:** Which parameter gives a plug-in access to execution context and platform services?

### DV-PLUGIN-004 — IPluginExecutionContext

**Origin:** `DOC`

**Prompt:** Write the common line that retrieves the plug-in execution context.

### DV-PLUGIN-005 — ITracingService

**Origin:** `GAP`

**Prompt:** Write the common line that retrieves the tracing service.

### DV-PLUGIN-006 — IOrganizationServiceFactory

**Origin:** `GAP`

**Prompt:** Write the common line that retrieves the organization service factory.

### DV-PLUGIN-007 — IOrganizationServiceFactory

**Origin:** `DOC`

**Prompt:** Create an `IOrganizationService` that runs as the current plug-in user.

### DV-PLUGIN-008 — IPluginExecutionContext.MessageName

**Origin:** `DOC`

**Prompt:** Which execution-context property tells you whether the current message is Create, Update, Delete, and so on?

### DV-PLUGIN-009 — IPluginExecutionContext.Stage

**Origin:** `GAP`

**Prompt:** Which context property identifies the pipeline stage?

### DV-PLUGIN-010 — IPluginExecutionContext.Mode

**Origin:** `GAP`

**Prompt:** Which context property tells you whether execution is synchronous or asynchronous?

### DV-PLUGIN-011 — IPluginExecutionContext.Depth

**Origin:** `GAP`

**Prompt:** Which context property is commonly checked to detect recursive/nested plug-in execution?

### DV-PLUGIN-012 — IPluginExecutionContext.UserId

**Origin:** `GAP`

**Prompt:** Which context property identifies the user the plug-in is executing as?

### DV-PLUGIN-013 — IPluginExecutionContext.InitiatingUserId

**Origin:** `GAP`

**Prompt:** Which property identifies the user who originally initiated the operation?

### DV-PLUGIN-014 — IPluginExecutionContext.PrimaryEntityName

**Origin:** `GAP`

**Prompt:** Which property gives the logical name of the primary Dataverse table for the event?

### DV-PLUGIN-015 — IPluginExecutionContext.PrimaryEntityId

**Origin:** `GAP`

**Prompt:** Which property gives the primary row ID?

### DV-PLUGIN-016 — InputParameters

**Origin:** `GAP`

**Prompt:** Where is the target row normally found for Create/Update messages?

### DV-PLUGIN-017 — Target Entity

**Origin:** `GAP`

**Prompt:** Write a safe pattern that obtains the Target as an `Entity`.

### DV-PLUGIN-018 — SharedVariables

**Origin:** `DOC`

**Prompt:** Which execution-context property passes custom data to later plug-in steps in the same pipeline?

### DV-PLUGIN-019 — SharedVariables

**Origin:** `GAP`

**Prompt:** Store a value named `RiskScore` for a later step.

### DV-PLUGIN-020 — SharedVariables

**Origin:** `GAP`

**Prompt:** Read a previously stored `RiskScore`.

### DV-PLUGIN-021 — PreEntityImages

**Origin:** `DOC`

**Prompt:** Which context collection contains registered pre-operation snapshots?

### DV-PLUGIN-022 — PostEntityImages

**Origin:** `DOC`

**Prompt:** Which context collection contains registered post-operation snapshots?

### DV-PLUGIN-023 — Entity images

**Origin:** `DOC`

**Prompt:** Why use entity images instead of an extra `Retrieve` just to compare old/new values?

### DV-PLUGIN-024 — Entity images

**Origin:** `DOC`

**Prompt:** Should you accept the default 'all columns' image configuration?

### DV-PLUGIN-025 — OutputParameters

**Origin:** `DOC`

**Prompt:** What does `context.OutputParameters` contain?

### DV-PLUGIN-026 — InvalidPluginExecutionException

**Origin:** `DOC`

**Prompt:** Which exception class should a plug-in throw to cancel an operation with a user-facing message?

### DV-PLUGIN-027 — PreValidation

**Origin:** `DOC`

**Prompt:** Which stage is preferred for rejecting invalid input before the initial database transaction?

### DV-PLUGIN-028 — PreOperation

**Origin:** `DOC`

**Prompt:** Which stage should you use to change values on the incoming Target before Dataverse writes the row?

### DV-PLUGIN-029 — PostOperation

**Origin:** `DOC`

**Prompt:** Which synchronous stage is appropriate when logic needs the completed operation/result?

### DV-PLUGIN-030 — Async stage

**Origin:** `GAP`

**Prompt:** At which pipeline stage can a step be registered asynchronously?

### DV-PLUGIN-031 — Stateless plug-ins

**Origin:** `DOC`

**Prompt:** Should an `IPlugin` implementation store `IOrganizationService` or `IPluginExecutionContext` in mutable instance fields?

### DV-PLUGIN-032 — Secure configuration

**Origin:** `DOC`

**Prompt:** How are secure and unsecure plug-in registration configuration values passed to the plug-in?

### DV-PLUGIN-033 — Secure configuration

**Origin:** `DOC`

**Prompt:** Where is secure plug-in configuration stored?

### DV-PLUGIN-034 — Early-bound vs late-bound

**Origin:** `DOC`

**Prompt:** What is an early-bound Dataverse class?

### DV-PLUGIN-035 — Early-bound InputParameters

**Origin:** `DOC`

**Prompt:** What type are table values supplied in plug-in `InputParameters`?

### DV-PLUGIN-036 — Entity

**Origin:** `GAP`

**Prompt:** What SDK class represents a generic Dataverse row in late-bound code?

### DV-PLUGIN-037 — EntityReference

**Origin:** `GAP`

**Prompt:** What SDK class represents a reference to another Dataverse row?

### DV-PLUGIN-038 — EntityReference

**Origin:** `GAP`

**Prompt:** Create an EntityReference to Account with ID `accountId`.

### DV-PLUGIN-039 — EntityCollection

**Origin:** `GAP`

**Prompt:** What SDK class represents a collection of Dataverse `Entity` rows?

### DV-PLUGIN-040 — ColumnSet

**Origin:** `GAP`

**Prompt:** Retrieve only `name` and `accountnumber` for an Account. What `ColumnSet` should you use?

### DV-PLUGIN-041 — OptionSetValue

**Origin:** `GAP`

**Prompt:** Which SDK class represents a Dataverse Choice/Option Set value in traditional SDK code?

### DV-PLUGIN-042 — Money

**Origin:** `GAP`

**Prompt:** Which SDK class represents a Dataverse Currency value?

### DV-PLUGIN-043 — IOrganizationService

**Origin:** `DOC`

**Prompt:** Which interface exposes the core Organization service methods?

### DV-PLUGIN-044 — IOrganizationService methods

**Origin:** `GAP`

**Prompt:** Name the eight methods directly defined by `IOrganizationService`.

### DV-PLUGIN-045 — Create

**Origin:** `GAP`

**Prompt:** Create an Account Entity through `IOrganizationService`.

### DV-PLUGIN-046 — Retrieve

**Origin:** `GAP`

**Prompt:** Retrieve one Account by ID and selected columns.

### DV-PLUGIN-047 — RetrieveMultiple

**Origin:** `DOC`

**Prompt:** Which Organization service method executes a `QueryExpression`, `FetchExpression`, or `QueryByAttribute` and returns multiple rows?

### DV-PLUGIN-048 — RetrieveMultiple

**Origin:** `GAP`

**Prompt:** Write the common syntax to execute a `QueryExpression query`.

### DV-PLUGIN-049 — Update

**Origin:** `GAP`

**Prompt:** Update a late-bound Account's name without retrieving the whole row first.

### DV-PLUGIN-050 — Delete

**Origin:** `GAP`

**Prompt:** Delete an Account by ID.

### DV-PLUGIN-051 — Associate

**Origin:** `GAP`

**Prompt:** Which `IOrganizationService` method links rows through a relationship?

### DV-PLUGIN-052 — Disassociate

**Origin:** `GAP`

**Prompt:** Which method removes a relationship link without deleting the rows?

### DV-PLUGIN-053 — Execute

**Origin:** `DOC`

**Prompt:** When do you use `IOrganizationService.Execute(...)` instead of the CRUD methods?

### DV-PLUGIN-054 — OrganizationRequest

**Origin:** `GAP`

**Prompt:** What is `OrganizationRequest`?

### DV-PLUGIN-055 — CreateRequest

**Origin:** `DOC`

**Prompt:** What request class represents the Create message when using the message/request pattern?

### DV-PLUGIN-056 — ServiceClient

**Origin:** `DOC`

**Prompt:** Which `IOrganizationService` implementation does Microsoft recommend for new client application development?

### DV-PLUGIN-057 — CrmServiceClient

**Origin:** `DOC`

**Prompt:** How should you treat `Microsoft.Xrm.Tooling.Connector.CrmServiceClient` in new code?

### DV-PLUGIN-058 — QueryExpression

**Origin:** `GAP`

**Prompt:** Create a query for Accounts that returns only the `name` column.

### DV-PLUGIN-059 — QueryExpression condition

**Origin:** `GAP`

**Prompt:** Add a condition `statecode = 0` to a `QueryExpression`.

### DV-PLUGIN-060 — FetchExpression

**Origin:** `DOC`

**Prompt:** Which Organization service query type wraps FetchXML?

### DV-PLUGIN-061 — QueryByAttribute

**Origin:** `GAP`

**Prompt:** Which query class is the simple attribute/value equality query type?

### DV-PLUGIN-062 — UpsertRequest

**Origin:** `GAP`

**Prompt:** Which message is designed for create-or-update synchronization scenarios?

### DV-PLUGIN-063 — ExecuteMultipleRequest

**Origin:** `GAP`

**Prompt:** Does `ExecuteMultipleRequest` make all child requests one database transaction?

### DV-PLUGIN-064 — ExecuteTransactionRequest

**Origin:** `DOC`

**Prompt:** Which request executes multiple SDK requests as one atomic transaction?

### DV-PLUGIN-065 — Bulk messages

**Origin:** `GAP`

**Prompt:** Name the modern bulk message requests for create, update, and upsert operations.

### DV-PLUGIN-066 — IServiceEndpointNotificationService

**Origin:** `DOC`

**Prompt:** Which interface is used by an Azure-aware Dataverse plug-in to post the execution context to a registered Azure service endpoint?

### DV-PLUGIN-067 — IServiceEndpointNotificationService

**Origin:** `DOC`

**Prompt:** How is the Azure service endpoint normally identified to the plug-in?

### DV-PLUGIN-068 — IManagedIdentityService

**Origin:** `DOC`

**Prompt:** Which Dataverse plug-in service can acquire a token for outbound access to Azure resources using Power Platform managed identity?

## Dataverse SDK — custom APIs and supporting .NET types

### DV-SDK-001 — Custom API binding

**Origin:** `DOC`

**Prompt:** A custom API is bound to a single Dataverse row. Which binding type should be selected?

### DV-SDK-002 — Custom API Target

**Origin:** `DOC`

**Prompt:** When a custom API uses `Entity` binding, which request parameter is automatically created and what type is it?

### DV-SDK-003 — Custom API global

**Origin:** `DOC`

**Prompt:** Which custom API binding is used when the operation is not associated with a specific table?

### DV-SDK-004 — Custom API EntityCollection

**Origin:** `DOC`

**Prompt:** Which custom API binding represents an operation associated with a collection/entity set?

### DV-SDK-005 — Custom API plug-in

**Origin:** `DOC`

**Prompt:** Where does pro-code business logic for a Dataverse custom API normally live?

### DV-SDK-006 — custom request parameters

**Origin:** `GAP`

**Prompt:** Inside the plug-in implementing a custom API, where are request parameter values read?

### DV-SDK-007 — custom response properties

**Origin:** `GAP`

**Prompt:** Inside the plug-in implementing a custom API, where are response values written?

### DV-SDK-008 — OrganizationServiceContext

**Origin:** `GAP`

**Prompt:** Which SDK class provides a LINQ/tracking-style context over `IOrganizationService`?

### DV-SDK-009 — OrganizationServiceContext SaveChanges

**Origin:** `GAP`

**Prompt:** Which method commits tracked changes in an `OrganizationServiceContext`?

### DV-SDK-010 — CodeActivity

**Origin:** `DOC`

**Prompt:** Which .NET base class is used for a traditional custom workflow activity?

### DV-SDK-011 — CodeActivityContext

**Origin:** `DOC`

**Prompt:** What context parameter is passed to a custom workflow activity `Execute` method?

### DV-SDK-012 — IWorkflowContext

**Origin:** `GAP`

**Prompt:** Which Dataverse SDK interface contains workflow execution information for a custom workflow activity?

### DV-SDK-013 — OptionSetValue.Value

**Origin:** `GAP`

**Prompt:** How do you get the integer from an SDK `OptionSetValue choice`?

### DV-SDK-014 — Money.Value

**Origin:** `GAP`

**Prompt:** How do you get the decimal amount from an SDK `Money money`?

### DV-SDK-015 — AliasedValue

**Origin:** `GAP`

**Prompt:** Which SDK class commonly wraps values returned from FetchXML/QueryExpression aliases or aggregate/grouping queries?

## Model-driven apps — Client API / Xrm syntax

### XRM-001 — formContext

**Origin:** `DOC`

**Prompt:** In a modern model-driven app event handler, what is the syntax for getting the current form context from the event execution context?

### XRM-002 — Xrm.Page

**Origin:** `DOC`

**Prompt:** Which older global form object should new client scripting avoid in favor of `formContext`?

### XRM-003 — form type

**Origin:** `DOC`

**Prompt:** What Client API expression returns the current form type?

### XRM-004 — attribute value

**Origin:** `GAP`

**Prompt:** What is the common syntax to read a Dataverse column value on a model-driven form?

### XRM-005 — attribute value

**Origin:** `GAP`

**Prompt:** What is the common syntax to set a Dataverse column value on a model-driven form?

### XRM-006 — control visibility

**Origin:** `GAP`

**Prompt:** How do you hide a control named `creditlimit` using the Client API?

### XRM-007 — required level

**Origin:** `GAP`

**Prompt:** How do you make a form column required through the Client API?

### XRM-008 — event source

**Origin:** `GAP`

**Prompt:** Which execution-context method returns the control or attribute that caused the event?

### XRM-009 — event args

**Origin:** `GAP`

**Prompt:** Which execution-context method gives access to event-specific arguments such as save-event information?

### XRM-010 — prevent save

**Origin:** `GAP`

**Prompt:** In an `OnSave` handler, what syntax cancels the save?

### XRM-011 — openErrorDialog

**Origin:** `DOC`

**Prompt:** Which Client API call shows an error dialog?

### XRM-012 — openErrorDialog details

**Origin:** `DOC`

**Prompt:** You want the error dialog to include a **Download Log File** button containing `error.message`. What object shape should you pass?

### XRM-013 — openAlertDialog

**Origin:** `DOC`

**Prompt:** Which Client API call shows a normal alert rather than the error dialog?

### XRM-014 — navigateTo

**Origin:** `DOC`

**Prompt:** Which Client API method is used to navigate to a page or open a supported page in a dialog?

### XRM-015 — navigateTo result

**Origin:** `DOC`

**Prompt:** When `navigateTo` opens a table form in create mode, where can the created row reference be returned when the dialog closes?

### XRM-016 — Xrm.WebApi create

**Origin:** `GAP`

**Prompt:** What is the core syntax for creating a Dataverse row from model-driven client script?

### XRM-017 — Xrm.WebApi retrieve

**Origin:** `GAP`

**Prompt:** What method retrieves one Dataverse row in model-driven client script?

### XRM-018 — Xrm.WebApi retrieve multiple

**Origin:** `DOC`

**Prompt:** What method retrieves a collection of Dataverse rows in model-driven client script?

### XRM-019 — Xrm.WebApi update

**Origin:** `GAP`

**Prompt:** What is the core syntax for updating a Dataverse row in model-driven client script?

### XRM-020 — Xrm.WebApi delete

**Origin:** `GAP`

**Prompt:** What method deletes one Dataverse row in model-driven client script?

### XRM-021 — Xrm.WebApi execute

**Origin:** `GAP`

**Prompt:** Which `Xrm.WebApi` member executes a single Web API action, function, or CRUD request object?

### XRM-022 — Xrm.WebApi executeMultiple

**Origin:** `GAP`

**Prompt:** Which `Xrm.WebApi` member executes a collection of action, function, or CRUD requests?

### XRM-023 — FetchXML

**Origin:** `DOC`

**Prompt:** Can JavaScript using the Dataverse Web API query with FetchXML?

### XRM-024 — OData

**Origin:** `DOC`

**Prompt:** Which OData version is used by the modern Dataverse Web API?

### XRM-025 — duplicate detection

**Origin:** `DOC`

**Prompt:** For a Dataverse Web API `PATCH`, what value of `MSCRM.SuppressDuplicateDetection` enables duplicate detection?

## PCF — interfaces and lifecycle syntax

### PCF-001 — StandardControl

**Origin:** `DOC`

**Prompt:** Which interface is commonly implemented by a standard PCF component class?

### PCF-002 — lifecycle

**Origin:** `DOC`

**Prompt:** Name the four core `StandardControl` lifecycle methods you should recognize.

### PCF-003 — init signature

**Origin:** `DOC`

**Prompt:** What is the shape of the PCF `init` method signature?

### PCF-004 — init

**Origin:** `DOC`

**Prompt:** What is `init` for in a PCF component?

### PCF-005 — notifyOutputChanged

**Origin:** `DOC`

**Prompt:** A user changes a value inside your PCF component. Which callback should your component invoke to tell the framework it has new output?

### PCF-006 — getOutputs

**Origin:** `DOC`

**Prompt:** After `notifyOutputChanged()` is called, which lifecycle method does the framework use to obtain the component’s changed bound values?

### PCF-007 — getOutputs syntax

**Origin:** `GAP`

**Prompt:** A manifest has a bound property named `value`. What should `getOutputs()` return if the current component value is `this._value`?

### PCF-008 — updateView

**Origin:** `DOC`

**Prompt:** Which PCF method is invoked when values in the property bag change?

### PCF-009 — direction

**Origin:** `DOC`

**Prompt:** Complete the direction rule: `updateView` is data ___ the component; `getOutputs` is data ___ the component.

### PCF-010 — destroy

**Origin:** `DOC`

**Prompt:** Which PCF lifecycle method should remove event handlers and release component resources?

### PCF-011 — manifest

**Origin:** `DOC`

**Prompt:** What file defines a PCF component’s metadata, properties, resources, and capabilities?

### PCF-012 — manifest property usage

**Origin:** `DOC`

**Prompt:** Which manifest property `usage` value allows the component to return a changed value to the host?

### PCF-013 — manifest input property

**Origin:** `GAP`

**Prompt:** Which manifest property `usage` value is for a value supplied to the component but not written back?

### PCF-014 — generated types

**Origin:** `DOC`

**Prompt:** Which generated TypeScript interfaces normally represent manifest inputs and outputs?

### PCF-015 — context.webAPI

**Origin:** `GAP`

**Prompt:** Which PCF context feature exposes methods for creating, retrieving, updating, and deleting Dataverse rows in supported hosts?

### PCF-016 — context.parameters

**Origin:** `GAP`

**Prompt:** How do you access a manifest property named `sampleProperty` from a PCF context?

### PCF-017 — raw value

**Origin:** `GAP`

**Prompt:** If `sampleProperty` is a bound/input field property, what member commonly contains its current raw value?

### PCF-018 — index.ts

**Origin:** `DOC`

**Prompt:** Which TypeScript file normally contains the PCF component class and lifecycle method implementations?

### PCF-019 — resources

**Origin:** `GAP`

**Prompt:** Name three resource types, besides the TypeScript code resource, that a PCF manifest can include.

---

# Answer Key

## Power Fx — Core syntax

### PFX-CORE-001 — Control properties

**Answer:** `Items`

**Explanation / memory hook:** `Items` defines the table shown by list controls; `OnSelect` is a behavior formula.

**Origin:** `DOC`

### PFX-CORE-002 — Filter

**Answer:** `Filter(Accounts, Status = "Active")`

**Explanation / memory hook:** `Filter` returns a table of all matching records.

**Origin:** `GAP`

### PFX-CORE-003 — Filter

**Answer:** `Filter(Orders, Total > 1000 && Status = "Open")`

**Explanation / memory hook:** Multiple conditions can be combined with `&&` / `And`.

**Origin:** `GAP`

### PFX-CORE-004 — LookUp

**Answer:** `LookUp(Accounts, AccountNumber = "A100")`

**Explanation / memory hook:** `LookUp` returns one record; `Filter` returns a table.

**Origin:** `GAP`

### PFX-CORE-005 — LookUp reduction

**Answer:** `LookUp(Accounts, AccountNumber = "A100", Name)`

**Explanation / memory hook:** The optional third argument reduces the matching record to a value.

**Origin:** `GAP`

### PFX-CORE-006 — Search

**Answer:** `Search(Accounts, txtSearch.Text, Name)`

**Explanation / memory hook:** `Search` finds text within one or more text columns; delegation support depends on the host/data source.

**Origin:** `GAP`

### PFX-CORE-007 — Sort

**Answer:** `Sort(Accounts, Name, SortOrder.Ascending)`

**Explanation / memory hook:** `Sort` accepts a formula as its sort key.

**Origin:** `GAP`

### PFX-CORE-008 — SortByColumns

**Answer:** `SortByColumns(Accounts, "name", SortOrder.Descending)`

**Explanation / memory hook:** `SortByColumns` identifies columns by name.

**Origin:** `GAP`

### PFX-CORE-009 — First

**Answer:** `First(Accounts)`

**Origin:** `GAP`

### PFX-CORE-010 — FirstN

**Answer:** `FirstN(Accounts, 10)`

**Explanation / memory hook:** Be aware of delegation limits for large remote data sources.

**Origin:** `GAP`

### PFX-CORE-011 — Last

**Answer:** `Last(colOrders)`

**Origin:** `GAP`

### PFX-CORE-012 — LastN

**Answer:** `LastN(colOrders, 5)`

**Origin:** `GAP`

### PFX-CORE-013 — CountRows

**Answer:** `CountRows(colOrders)`

**Origin:** `GAP`

### PFX-CORE-014 — Distinct

**Answer:** `Distinct(Accounts, City)`

**Explanation / memory hook:** `Distinct` can be nondelegable depending on data source/context.

**Origin:** `GAP`

### PFX-CORE-015 — Choices

**Answer:** `Choices(Accounts.'Primary Contact')`

**Explanation / memory hook:** `Choices` is convenient for Choice/Lookup metadata-backed values but can be unsuitable for very large lookup lists.

**Origin:** `DOC`

### PFX-CORE-016 — Patch update

**Answer:** `Patch(Orders, LookUp(Orders, OrderId = 42), { Status: "Closed" })`

**Explanation / memory hook:** The second argument identifies the existing base record.

**Origin:** `DOC`

### PFX-CORE-017 — Patch create

**Answer:** `Patch(Inventory, Defaults(Inventory), { ProductName: "Camera" })`

**Explanation / memory hook:** `Defaults(DataSource)` is the common canvas-app pattern for creating a new record.

**Origin:** `DOC`

### PFX-CORE-018 — Patch multiple fields

**Answer:** `Patch(Accounts, Gallery1.Selected, { Name: txtName.Text, 'Credit Limit': Value(txtLimit.Text) })`

**Origin:** `GAP`

### PFX-CORE-019 — With + Patch

**Answer:** `With({ newOrder: Patch(Orders, Defaults(Orders), { Name: "New" }) }, newOrder.OrderId)`

**Explanation / memory hook:** `With` can hold a returned record as a local named value.

**Origin:** `GAP`

### PFX-CORE-020 — Collect

**Answer:** `Collect(colCart, { ProductId: 1, Quantity: 2 })`

**Explanation / memory hook:** `Collect` adds; it does not clear existing rows.

**Origin:** `GAP`

### PFX-CORE-021 — Clear

**Answer:** `Clear(colCart)`

**Explanation / memory hook:** `Clear` removes rows from a collection but keeps its columns.

**Origin:** `GAP`

### PFX-CORE-022 — ClearCollect

**Answer:** `ClearCollect(colAccounts, Filter(Accounts, Status = "Active"))`

**Explanation / memory hook:** This is a clear-then-collect pattern.

**Origin:** `DOC`

### PFX-CORE-023 — Remove

**Answer:** `Remove(Accounts, Gallery1.Selected)`

**Explanation / memory hook:** Use `Remove` when you already have the specific record.

**Origin:** `DOC`

### PFX-CORE-024 — RemoveIf

**Answer:** `RemoveIf(colCart, Quantity = 0)`

**Explanation / memory hook:** `RemoveIf` evaluates a predicate for rows.

**Origin:** `GAP`

### PFX-CORE-025 — Update

**Answer:** `Update(colCart, LookUp(colCart, ProductId = 1), { ProductId: 1, Quantity: 3 })`

**Explanation / memory hook:** `Update` replaces the entire record; use `Patch` for partial changes.

**Origin:** `GAP`

### PFX-CORE-026 — UpdateIf

**Answer:** `UpdateIf(colItems, EndDate < Today(), { Status: "Expired" })`

**Explanation / memory hook:** `UpdateIf` applies changes to all matching records.

**Origin:** `GAP`

### PFX-CORE-027 — Refresh

**Answer:** `Refresh(Accounts)`

**Origin:** `GAP`

### PFX-CORE-028 — Set

**Answer:** `Set(varAccountId, Gallery1.Selected.AccountId)`

**Explanation / memory hook:** `Set` creates a global variable available across screens.

**Origin:** `GAP`

### PFX-CORE-029 — UpdateContext

**Answer:** `UpdateContext({ showDetails: true })`

**Explanation / memory hook:** `UpdateContext` creates a context variable scoped to the current screen.

**Origin:** `GAP`

### PFX-CORE-030 — Navigate context

**Answer:** `Navigate(DetailsScreen, ScreenTransition.None, { accountId: Gallery1.Selected.AccountId })`

**Explanation / memory hook:** The third argument creates/updates context variables on the target screen.

**Origin:** `GAP`

### PFX-CORE-031 — With

**Answer:** `With({ p: price, q: quantity }, p * q)`

**Explanation / memory hook:** `With` creates local named values and improves formula readability.

**Origin:** `DOC`

### PFX-CORE-032 — Named formulas

**Answer:** `App.Formulas`

**Explanation / memory hook:** `With` creates local named values and `Set` creates global variables; neither is the same thing as an app named formula.

**Origin:** `GAP`

### PFX-CORE-033 — Named formulas

**Answer:** `TaxRate = 0.15;` in `App.Formulas`

**Explanation / memory hook:** Named formulas are declarative and can be evaluated when needed.

**Origin:** `GAP`

### PFX-CORE-034 — Concurrent

**Answer:** `Concurrent(ClearCollect(colAccounts, Accounts), ClearCollect(colContacts, Contacts))`

**Explanation / memory hook:** Use when the operations are independent; do not create dependencies between sibling arguments.

**Origin:** `GAP`

### PFX-CORE-035 — If

**Answer:** `If(Total > 1000, "High", "Normal")`

**Origin:** `GAP`

### PFX-CORE-036 — Switch

**Answer:** `Switch(Status, 1, "New", 2, "Approved", "Other")`

**Origin:** `GAP`

### PFX-CORE-037 — Coalesce

**Answer:** `Coalesce(Nickname, FullName)`

**Explanation / memory hook:** Returns the first value that isn't blank/empty string.

**Origin:** `GAP`

### PFX-CORE-038 — IsBlank

**Answer:** `IsBlank(txtEmail.Text)`

**Origin:** `GAP`

### PFX-CORE-039 — IsEmpty

**Answer:** `IsEmpty(colResults)`

**Explanation / memory hook:** `IsBlank` is for blank values; `IsEmpty` is for tables with zero rows.

**Origin:** `GAP`

### PFX-CORE-040 — IfError

**Answer:** `IfError(Patch(Accounts, Gallery1.Selected, { Name: txtName.Text }), Notify("Update failed", NotificationType.Error))`

**Explanation / memory hook:** `IfError` is the direct way to branch on formula errors.

**Origin:** `GAP`

### PFX-CORE-041 — Errors

**Answer:** `Errors(Accounts)`

**Explanation / memory hook:** Useful for inspecting data-source errors; behavior depends on formula-level error management.

**Origin:** `GAP`

### PFX-CORE-042 — Notify

**Answer:** `Notify("Save failed", NotificationType.Error)`

**Origin:** `GAP`

### PFX-CORE-043 — ForAll

**Answer:** `ForAll(colSelected, Patch(Tasks, Defaults(Tasks), { Subject: ThisRecord.Name }))`

**Explanation / memory hook:** `ForAll` evaluates a formula for each record; it is often nondelegable.

**Origin:** `GAP`

### PFX-CORE-044 — Sequence

**Answer:** `Sequence(10)`

**Origin:** `GAP`

### PFX-CORE-045 — ThisRecord

**Answer:** `ThisRecord`

**Explanation / memory hook:** Useful when names are ambiguous or nested.

**Origin:** `GAP`

### PFX-CORE-046 — As operator

**Answer:** `Filter(Accounts As acct, acct.Status = "Active")`

**Explanation / memory hook:** `As` makes nested record scopes clearer.

**Origin:** `GAP`

### PFX-CORE-047 — ThisItem

**Answer:** `ThisItem.Name`

**Explanation / memory hook:** `ThisItem` is the current record exposed by a gallery/form-style control.

**Origin:** `GAP`

### PFX-CORE-048 — Self

**Answer:** `Self.Text`

**Explanation / memory hook:** `Self` avoids hard-coding the control name.

**Origin:** `DOC`

### PFX-CORE-049 — Parent

**Answer:** `Parent.Width`

**Origin:** `GAP`

### PFX-CORE-050 — SubmitForm

**Answer:** `SubmitForm(EditForm1)`

**Origin:** `GAP`

### PFX-CORE-051 — ResetForm

**Answer:** `ResetForm(EditForm1)`

**Origin:** `GAP`

### PFX-CORE-052 — NewForm

**Answer:** `NewForm(EditForm1)`

**Origin:** `GAP`

### PFX-CORE-053 — EditForm

**Answer:** `EditForm(EditForm1)`

**Origin:** `GAP`

### PFX-CORE-054 — ViewForm

**Answer:** `ViewForm(EditForm1)`

**Origin:** `GAP`

### PFX-CORE-055 — Reset

**Answer:** `Reset(txtSearch)`

**Origin:** `GAP`

### PFX-CORE-056 — Navigate

**Answer:** `Navigate(DetailsScreen, ScreenTransition.Fade)`

**Origin:** `GAP`

### PFX-CORE-057 — Back

**Answer:** `Back()`

**Origin:** `GAP`

### PFX-CORE-058 — Flow call

**Answer:** `GetCustomers.Run(value1, value2)`

**Explanation / memory hook:** The uploaded failed-question set explicitly called out the `.Run(...)` syntax.

**Origin:** `DOC`

### PFX-CORE-059 — AddColumns

**Answer:** `AddColumns(Contacts, FullName, FirstName & " " & LastName)`

**Origin:** `GAP`

### PFX-CORE-060 — ShowColumns

**Answer:** `ShowColumns(Accounts, Name, AccountNumber)`

**Origin:** `GAP`

### PFX-CORE-061 — DropColumns

**Answer:** `DropColumns(Accounts, InternalNotes)`

**Origin:** `GAP`

### PFX-CORE-062 — RenameColumns

**Answer:** `RenameColumns(colData, OldName, NewName)`

**Origin:** `GAP`

### PFX-CORE-063 — GroupBy

**Answer:** `GroupBy(colSales, Region, RegionRows)`

**Origin:** `GAP`

### PFX-CORE-064 — Ungroup

**Answer:** `Ungroup(groupedSales, RegionRows)`

**Origin:** `GAP`

## Power Fx — Utility syntax

### PFX-UTIL-001 — Text

**Answer:** `Text(Total, "$#,##0.00")`

**Explanation / memory hook:** Formatting strings can be locale-sensitive; this question is about the function shape.

**Origin:** `GAP`

### PFX-UTIL-002 — Value

**Answer:** `Value(txtAmount.Text)`

**Origin:** `GAP`

### PFX-UTIL-003 — Boolean

**Answer:** `Boolean(value)`

**Origin:** `GAP`

### PFX-UTIL-004 — Today

**Answer:** `Today()`

**Origin:** `GAP`

### PFX-UTIL-005 — Now

**Answer:** `Now()`

**Origin:** `GAP`

### PFX-UTIL-006 — DateAdd

**Answer:** `DateAdd(StartDate, 7, TimeUnit.Days)`

**Origin:** `GAP`

### PFX-UTIL-007 — DateDiff

**Answer:** `DateDiff(StartDate, EndDate, TimeUnit.Days)`

**Origin:** `GAP`

### PFX-UTIL-008 — Year Month Day

**Answer:** `Year(StartDate)`

**Explanation / memory hook:** `Month(...)` and `Day(...)` follow the same shape.

**Origin:** `GAP`

### PFX-UTIL-009 — GUID

**Answer:** `GUID(txtId.Text)`

**Origin:** `GAP`

### PFX-UTIL-010 — Len

**Answer:** `Len(txtName.Text)`

**Origin:** `GAP`

### PFX-UTIL-011 — Left

**Answer:** `Left(Code, 3)`

**Origin:** `GAP`

### PFX-UTIL-012 — Right

**Answer:** `Right(Code, 4)`

**Origin:** `GAP`

### PFX-UTIL-013 — Mid

**Answer:** `Mid(Code, 3, 5)`

**Origin:** `GAP`

### PFX-UTIL-014 — TrimEnds

**Answer:** `TrimEnds(text)`

**Explanation / memory hook:** `Trim` also reduces runs of spaces; `TrimEnds` is the direct end-trimming function.

**Origin:** `GAP`

### PFX-UTIL-015 — Lower Upper

**Answer:** `Lower(Email)`

**Explanation / memory hook:** `Upper(...)` is the corresponding uppercase function.

**Origin:** `GAP`

### PFX-UTIL-016 — Concatenate

**Answer:** `Concatenate(FirstName, " ", LastName)`

**Origin:** `GAP`

### PFX-UTIL-017 — Substitute

**Answer:** `Substitute(Code, "-", "/")`

**Explanation / memory hook:** This function was explicitly present in the failed-question material.

**Origin:** `DOC`

### PFX-UTIL-018 — Split

**Answer:** `Split(Tags, ",")`

**Explanation / memory hook:** This function was explicitly contrasted with `With` in the failed-question material.

**Origin:** `DOC`

### PFX-UTIL-019 — IsMatch

**Answer:** `IsMatch(txtEmail.Text, Match.Email)`

**Origin:** `GAP`

### PFX-UTIL-020 — Match

**Answer:** `Match(text, pattern)`

**Origin:** `GAP`

### PFX-UTIL-021 — Rand

**Answer:** `Rand()`

**Origin:** `GAP`

### PFX-UTIL-022 — RandBetween

**Answer:** `RandBetween(1, 10)`

**Origin:** `GAP`

### PFX-UTIL-023 — Round

**Answer:** `Round(Amount, 2)`

**Origin:** `GAP`

### PFX-UTIL-024 — Max Min

**Answer:** `Max(Orders, Total)`

**Explanation / memory hook:** `Min(...)` has the same shape.

**Origin:** `GAP`

### PFX-UTIL-025 — Sum

**Answer:** `Sum(Orders, Total)`

**Origin:** `GAP`

### PFX-UTIL-026 — Average

**Answer:** `Average(colScores, Score)`

**Origin:** `GAP`

### PFX-UTIL-027 — User

**Answer:** `User()`

**Explanation / memory hook:** Remember that some hosts, such as model-driven commanding, support only a restricted Power Fx subset.

**Origin:** `GAP`

### PFX-UTIL-028 — Param

**Answer:** `Param("AccountId")`

**Origin:** `GAP`

### PFX-UTIL-029 — Blank

**Answer:** `Blank()`

**Origin:** `GAP`

### PFX-UTIL-030 — IsError

**Answer:** `IsError(expression)`

**Origin:** `GAP`

## Power Fx — Delegation, commands, and performance

### PFX-DEL-001 — Delegation

**Answer:** The Power Fx query is translated and executed by the remote data source, which returns only the needed results.

**Explanation / memory hook:** This is required for correct results over large data sources.

**Origin:** `GAP`

### PFX-DEL-002 — Delegation

**Answer:** Power Apps does not delegate any part of the query and evaluates it locally against the retrieved row limit.

**Explanation / memory hook:** This is the important all-or-nothing behavior.

**Origin:** `DOC`

### PFX-DEL-003 — Nondelegable limit

**Answer:** `500` records.

**Explanation / memory hook:** The setting can be raised, but this does not make a nondelegable query correct for arbitrary large data.

**Origin:** `DOC`

### PFX-DEL-004 — Nondelegable limit

**Answer:** `2,000` records.

**Origin:** `DOC`

### PFX-DEL-005 — Delegation testing

**Answer:** `1`

**Explanation / memory hook:** If the formula still appears to work with a limit of 1, it is strong evidence the relevant query delegates.

**Origin:** `DOC`

### PFX-DEL-006 — With delegation

**Answer:** `With` creates an in-memory collection internally; collections do not delegate, and this case can produce no delegation warning.

**Explanation / memory hook:** Absence of a warning is not proof of delegation.

**Origin:** `DOC`

### PFX-DEL-007 — Set delegation

**Answer:** No. `Set` creates in-memory state and cannot itself participate in delegation.

**Explanation / memory hook:** The uploaded bank specifically highlights the no-warning trap for `With`, `Set`, and `UpdateContext`.

**Origin:** `DOC`

### PFX-DEL-008 — UpdateContext delegation

**Answer:** No.

**Explanation / memory hook:** It creates screen-scoped in-memory state.

**Origin:** `DOC`

### PFX-DEL-009 — Filter delegation

**Answer:** No. It delegates only when the data source and every function/operator used in the predicate support delegation.

**Origin:** `GAP`

### PFX-DEL-010 — Sort delegation

**Answer:** When the data source supports delegation for the sort expression used.

**Explanation / memory hook:** A delegable function can become nondelegable because of the specific formula/data source.

**Origin:** `DOC`

### PFX-DEL-011 — Search delegation

**Answer:** No. Check the current delegation table and host support; do not infer delegation from the function name.

**Origin:** `GAP`

### PFX-DEL-012 — FirstN delegation

**Answer:** No. Limiting local results is not the same as delegating the query to the server.

**Origin:** `GAP`

### PFX-DEL-013 — Lookup expansion

**Answer:** Up to `2` lookup levels; offline scenarios support only `1`.

**Origin:** `GAP`

### PFX-DEL-014 — Lookup joins

**Answer:** `20` entities.

**Origin:** `GAP`

### PFX-DEL-015 — Delegation LHS

**Answer:** On the left-hand side of the equality operator.

**Explanation / memory hook:** Example: `Filter(Accounts, AccountId = someGuid)` rather than reversing the entity property to the right.

**Origin:** `GAP`

### PFX-DEL-016 — Command visibility

**Answer:** `CountRows(Self.Selected.AllItems) > 0`

**Explanation / memory hook:** This exact pattern appears in the uploaded material.

**Origin:** `DOC`

### PFX-DEL-017 — Command selection

**Answer:** `Self.Selected.AllItems`

**Explanation / memory hook:** Use `Self.Selected.Item` only when the command is configured for a single selection.

**Origin:** `DOC`

### PFX-DEL-018 — Command selection

**Answer:** It is blank.

**Explanation / memory hook:** This prevents single-row formulas from silently being used for multi-row commands.

**Origin:** `DOC`

### PFX-DEL-019 — Command Power Fx

**Answer:** No.

**Explanation / memory hook:** The commanding host has a restricted function set; the uploaded bank notes unsupported examples such as `User`, `Set`, `UpdateContext`, `Collect`, and `Param`.

**Origin:** `DOC`

### PFX-DEL-020 — Performance

**Answer:** Cache/reuse the data in collections or variables instead of repeatedly fetching the same source.

**Origin:** `DOC`

### PFX-DEL-021 — Concurrent dependencies

**Answer:** No.

**Explanation / memory hook:** Sibling formulas may start and finish in unpredictable order.

**Origin:** `GAP`

### PFX-DEL-022 — Concurrent scope

**Answer:** In behavior formulas.

**Explanation / memory hook:** It is for side-effecting/behavior formulas, not general declarative properties.

**Origin:** `GAP`

## Dataverse Power Fx — functions and low-code server logic

### DV-PFX-001 — current status

**Answer:** They are a **preview** feature.

**Explanation / memory hook:** Do not treat them as a mature GA replacement for C# plug-ins.

**Origin:** `GAP`

### DV-PFX-002 — instant plug-ins

**Answer:** Instant low-code plug-ins are deprioritized and are being replaced by **Functions in Microsoft Dataverse** (preview).

**Explanation / memory hook:** This is a current-version correction to older material.

**Origin:** `GAP`

### DV-PFX-003 — Dataverse Functions

**Answer:** Power Fx.

**Origin:** `GAP`

### DV-PFX-004 — Dataverse Functions parameters

**Answer:** Directly by their parameter names.

**Origin:** `GAP`

### DV-PFX-005 — Dataverse Functions outputs

**Answer:** `{ Out: "Return value" }`

**Explanation / memory hook:** Output parameters are returned as fields of a record in curly braces.

**Origin:** `GAP`

### DV-PFX-006 — Dataverse Functions tables

**Answer:** `Filter()` and `LookUp()` are key examples.

**Origin:** `GAP`

### DV-PFX-007 — low-code plug-in scope

**Answer:** Table/entity scope or global scope.

**Origin:** `GAP`

### DV-PFX-008 — instant parameters

**Answer:** Instant low-code plug-ins.

**Origin:** `GAP`

### DV-PFX-009 — automated plug-ins

**Answer:** Create, Update, and Delete table events.

**Origin:** `GAP`

### DV-PFX-010 — automated context

**Answer:** `ThisRecord`

**Origin:** `GAP`

### DV-PFX-011 — table disambiguation

**Answer:** `[@TableName]` — for example, `[@Accounts]`.

**Origin:** `GAP`

### DV-PFX-012 — server-side

**Answer:** Server-side in Dataverse.

**Explanation / memory hook:** That is why it can enforce logic independently of a particular canvas screen.

**Origin:** `GAP`

### DV-PFX-013 — unsupported functions

**Answer:** No. Low-code plug-ins support a restricted subset and some functions have limitations or alternatives.

**Origin:** `GAP`

### DV-PFX-014 — Defaults limitation

**Answer:** No. Current low-code plug-in guidance lists `Defaults` as unsupported; use the documented supported creation pattern such as `Collect` where appropriate.

**Origin:** `GAP`

### DV-PFX-015 — Concurrent limitation

**Answer:** No, not according to the current low-code plug-in supported-function table.

**Origin:** `GAP`

### DV-PFX-016 — Search limitation

**Answer:** No, not according to the current low-code plug-in supported-function table.

**Origin:** `GAP`

### DV-PFX-017 — Choices limitation

**Answer:** No, not according to the current low-code plug-in supported-function table.

**Origin:** `GAP`

## Dataverse — Plug-in interfaces, classes, context, and SDK syntax

### DV-PLUGIN-001 — IPlugin

**Answer:** `Microsoft.Xrm.Sdk.IPlugin`

**Origin:** `GAP`

### DV-PLUGIN-002 — IPlugin.Execute

**Answer:** `void Execute(IServiceProvider serviceProvider)`

**Explanation / memory hook:** `IServiceProvider` is the single entry point from which Dataverse services are requested.

**Origin:** `DOC`

### DV-PLUGIN-003 — IServiceProvider

**Answer:** `IServiceProvider serviceProvider`

**Explanation / memory hook:** The uploaded failed questions explicitly target remembering this name.

**Origin:** `DOC`

### DV-PLUGIN-004 — IPluginExecutionContext

**Answer:** `var context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));`

**Origin:** `DOC`

### DV-PLUGIN-005 — ITracingService

**Answer:** `var tracing = (ITracingService)serviceProvider.GetService(typeof(ITracingService));`

**Origin:** `GAP`

### DV-PLUGIN-006 — IOrganizationServiceFactory

**Answer:** `var factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));`

**Origin:** `GAP`

### DV-PLUGIN-007 — IOrganizationServiceFactory

**Answer:** `var service = factory.CreateOrganizationService(context.UserId);`

**Explanation / memory hook:** This binds operations to the selected user's privileges.

**Origin:** `DOC`

### DV-PLUGIN-008 — IPluginExecutionContext.MessageName

**Answer:** `context.MessageName`

**Origin:** `DOC`

### DV-PLUGIN-009 — IPluginExecutionContext.Stage

**Answer:** `context.Stage`

**Explanation / memory hook:** Typical numeric values are 10 PreValidation, 20 PreOperation, 40 PostOperation.

**Origin:** `GAP`

### DV-PLUGIN-010 — IPluginExecutionContext.Mode

**Answer:** `context.Mode`

**Origin:** `GAP`

### DV-PLUGIN-011 — IPluginExecutionContext.Depth

**Answer:** `context.Depth`

**Explanation / memory hook:** Do not use it as a blanket business-rule substitute, but know the syntax.

**Origin:** `GAP`

### DV-PLUGIN-012 — IPluginExecutionContext.UserId

**Answer:** `context.UserId`

**Origin:** `GAP`

### DV-PLUGIN-013 — IPluginExecutionContext.InitiatingUserId

**Answer:** `context.InitiatingUserId`

**Origin:** `GAP`

### DV-PLUGIN-014 — IPluginExecutionContext.PrimaryEntityName

**Answer:** `context.PrimaryEntityName`

**Origin:** `GAP`

### DV-PLUGIN-015 — IPluginExecutionContext.PrimaryEntityId

**Answer:** `context.PrimaryEntityId`

**Origin:** `GAP`

### DV-PLUGIN-016 — InputParameters

**Answer:** `context.InputParameters["Target"]`

**Explanation / memory hook:** For Create/Update it is typically an `Entity`; message-specific contracts still matter.

**Origin:** `GAP`

### DV-PLUGIN-017 — Target Entity

**Answer:** `if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity target) { ... }`

**Origin:** `GAP`

### DV-PLUGIN-018 — SharedVariables

**Answer:** `context.SharedVariables`

**Explanation / memory hook:** This is directly called out in several uploaded failed-question sets.

**Origin:** `DOC`

### DV-PLUGIN-019 — SharedVariables

**Answer:** `context.SharedVariables["RiskScore"] = score;`

**Origin:** `GAP`

### DV-PLUGIN-020 — SharedVariables

**Answer:** `var score = (int)context.SharedVariables["RiskScore"];`

**Explanation / memory hook:** Check existence/type in production code.

**Origin:** `GAP`

### DV-PLUGIN-021 — PreEntityImages

**Answer:** `context.PreEntityImages`

**Origin:** `DOC`

### DV-PLUGIN-022 — PostEntityImages

**Answer:** `context.PostEntityImages`

**Origin:** `DOC`

### DV-PLUGIN-023 — Entity images

**Answer:** They provide registered snapshots in the execution context and avoid an extra service call.

**Explanation / memory hook:** The uploaded docs repeatedly flag this as a plug-in performance pattern.

**Origin:** `DOC`

### DV-PLUGIN-024 — Entity images

**Answer:** No. Register only the columns the plug-in needs.

**Explanation / memory hook:** Returning all columns can hurt performance.

**Origin:** `DOC`

### DV-PLUGIN-025 — OutputParameters

**Answer:** Parameters of the response message after the core platform operation.

**Explanation / memory hook:** This is different from `SharedVariables`, which are for passing custom state between steps.

**Origin:** `DOC`

### DV-PLUGIN-026 — InvalidPluginExecutionException

**Answer:** `InvalidPluginExecutionException`

**Origin:** `DOC`

### DV-PLUGIN-027 — PreValidation

**Answer:** `PreValidation`

**Explanation / memory hook:** Use it for cancellation/validation when you do not want to force a transaction rollback.

**Origin:** `DOC`

### DV-PLUGIN-028 — PreOperation

**Answer:** `PreOperation`

**Origin:** `DOC`

### DV-PLUGIN-029 — PostOperation

**Answer:** `PostOperation`

**Origin:** `DOC`

### DV-PLUGIN-030 — Async stage

**Answer:** `PostOperation`

**Explanation / memory hook:** Asynchronous execution is not available for PreValidation/PreOperation.

**Origin:** `GAP`

### DV-PLUGIN-031 — Stateless plug-ins

**Answer:** No. Plug-in implementations should be stateless across invocations.

**Explanation / memory hook:** Configuration supplied via the constructor is a documented exception for member fields.

**Origin:** `DOC`

### DV-PLUGIN-032 — Secure configuration

**Answer:** As constructor string parameters, commonly `(string unsecure, string secure)`.

**Origin:** `DOC`

### DV-PLUGIN-033 — Secure configuration

**Answer:** In a separate Dataverse table readable only by appropriately privileged administrators.

**Origin:** `DOC`

### DV-PLUGIN-034 — Early-bound vs late-bound

**Answer:** A generated strongly typed .NET class for a Dataverse table, with CLR properties for columns.

**Explanation / memory hook:** Late-bound code uses the generic `Entity` class and logical names.

**Origin:** `DOC`

### DV-PLUGIN-035 — Early-bound InputParameters

**Answer:** Late-bound `Entity` types.

**Explanation / memory hook:** They may be converted/read as early-bound, but setting InputParameters with an early-bound instance can cause serialization problems.

**Origin:** `DOC`

### DV-PLUGIN-036 — Entity

**Answer:** `Microsoft.Xrm.Sdk.Entity`

**Origin:** `GAP`

### DV-PLUGIN-037 — EntityReference

**Answer:** `EntityReference`

**Origin:** `GAP`

### DV-PLUGIN-038 — EntityReference

**Answer:** `new EntityReference("account", accountId)`

**Origin:** `GAP`

### DV-PLUGIN-039 — EntityCollection

**Answer:** `EntityCollection`

**Origin:** `GAP`

### DV-PLUGIN-040 — ColumnSet

**Answer:** `new ColumnSet("name", "accountnumber")`

**Explanation / memory hook:** Avoid `new ColumnSet(true)` unless you truly need every column.

**Origin:** `GAP`

### DV-PLUGIN-041 — OptionSetValue

**Answer:** `OptionSetValue`

**Origin:** `GAP`

### DV-PLUGIN-042 — Money

**Answer:** `Money`

**Origin:** `GAP`

### DV-PLUGIN-043 — IOrganizationService

**Answer:** `IOrganizationService`

**Explanation / memory hook:** Microsoft currently recommends `ServiceClient` for new client applications.

**Origin:** `DOC`

### DV-PLUGIN-044 — IOrganizationService methods

**Answer:** `Associate`, `Create`, `Delete`, `Disassociate`, `Execute`, `Retrieve`, `RetrieveMultiple`, `Update`

**Origin:** `GAP`

### DV-PLUGIN-045 — Create

**Answer:** `Guid id = service.Create(accountEntity);`

**Origin:** `GAP`

### DV-PLUGIN-046 — Retrieve

**Answer:** `Entity account = service.Retrieve("account", accountId, new ColumnSet("name"));`

**Origin:** `GAP`

### DV-PLUGIN-047 — RetrieveMultiple

**Answer:** `RetrieveMultiple`

**Explanation / memory hook:** This exact distinction appears in the uploaded bank.

**Origin:** `DOC`

### DV-PLUGIN-048 — RetrieveMultiple

**Answer:** `EntityCollection results = service.RetrieveMultiple(query);`

**Origin:** `GAP`

### DV-PLUGIN-049 — Update

**Answer:** `var account = new Entity("account", accountId) { ["name"] = "New Name" }; service.Update(account);`

**Origin:** `GAP`

### DV-PLUGIN-050 — Delete

**Answer:** `service.Delete("account", accountId);`

**Origin:** `GAP`

### DV-PLUGIN-051 — Associate

**Answer:** `Associate`

**Origin:** `GAP`

### DV-PLUGIN-052 — Disassociate

**Answer:** `Disassociate`

**Origin:** `GAP`

### DV-PLUGIN-053 — Execute

**Answer:** When invoking a Dataverse message represented by an `OrganizationRequest` or derived request class.

**Origin:** `DOC`

### DV-PLUGIN-054 — OrganizationRequest

**Answer:** The base SDK request type for message-based operations executed through `IOrganizationService.Execute`.

**Origin:** `GAP`

### DV-PLUGIN-055 — CreateRequest

**Answer:** `CreateRequest`

**Explanation / memory hook:** A matching `CreateResponse` is returned.

**Origin:** `DOC`

### DV-PLUGIN-056 — ServiceClient

**Answer:** `Microsoft.PowerPlatform.Dataverse.Client.ServiceClient`

**Explanation / memory hook:** It supports modern MSAL authentication and additional features.

**Origin:** `DOC`

### DV-PLUGIN-057 — CrmServiceClient

**Answer:** As the older implementation; prefer `ServiceClient` for new development.

**Explanation / memory hook:** Some uploaded failed questions mention `CrmServiceClient`; the current SDK guidance recommends `ServiceClient`.

**Origin:** `DOC`

### DV-PLUGIN-058 — QueryExpression

**Answer:** `var query = new QueryExpression("account") { ColumnSet = new ColumnSet("name") };`

**Origin:** `GAP`

### DV-PLUGIN-059 — QueryExpression condition

**Answer:** `query.Criteria.AddCondition("statecode", ConditionOperator.Equal, 0);`

**Origin:** `GAP`

### DV-PLUGIN-060 — FetchExpression

**Answer:** `FetchExpression`

**Explanation / memory hook:** Uploaded material notes it is useful when FetchXML features such as aggregation are needed.

**Origin:** `DOC`

### DV-PLUGIN-061 — QueryByAttribute

**Answer:** `QueryByAttribute`

**Origin:** `GAP`

### DV-PLUGIN-062 — UpsertRequest

**Answer:** `UpsertRequest`

**Explanation / memory hook:** PL-400 currently lists alternate keys and `UpsertRequest` under data synchronization.

**Origin:** `GAP`

### DV-PLUGIN-063 — ExecuteMultipleRequest

**Answer:** No. Each request is processed in a separate database transaction.

**Explanation / memory hook:** It reduces round trips but is not atomic across the collection.

**Origin:** `GAP`

### DV-PLUGIN-064 — ExecuteTransactionRequest

**Answer:** `ExecuteTransactionRequest`

**Explanation / memory hook:** If one request fails, the transaction is rolled back.

**Origin:** `DOC`

### DV-PLUGIN-065 — Bulk messages

**Answer:** `CreateMultipleRequest`, `UpdateMultipleRequest`, `UpsertMultipleRequest`

**Origin:** `GAP`

### DV-PLUGIN-066 — IServiceEndpointNotificationService

**Answer:** `IServiceEndpointNotificationService`

**Explanation / memory hook:** The PL-400 study guide explicitly names this interface.

**Origin:** `DOC`

### DV-PLUGIN-067 — IServiceEndpointNotificationService

**Answer:** Create/register the service endpoint, then pass its ID as plug-in step configuration rather than hard-coding an environment-specific GUID.

**Origin:** `DOC`

### DV-PLUGIN-068 — IManagedIdentityService

**Answer:** `IManagedIdentityService`

**Origin:** `DOC`

## Dataverse SDK — custom APIs and supporting .NET types

### DV-SDK-001 — Custom API binding

**Answer:** `Entity` binding.

**Origin:** `DOC`

### DV-SDK-002 — Custom API Target

**Answer:** `Target` of type `EntityReference`.

**Origin:** `DOC`

### DV-SDK-003 — Custom API global

**Answer:** `Global`

**Origin:** `DOC`

### DV-SDK-004 — Custom API EntityCollection

**Answer:** `EntityCollection`

**Explanation / memory hook:** The binding itself does not automatically hand you a collection parameter.

**Origin:** `DOC`

### DV-SDK-005 — Custom API plug-in

**Answer:** In a registered plug-in type/assembly configured as the custom API plug-in type.

**Origin:** `DOC`

### DV-SDK-006 — custom request parameters

**Answer:** `context.InputParameters`

**Origin:** `GAP`

### DV-SDK-007 — custom response properties

**Answer:** `context.OutputParameters`

**Origin:** `GAP`

### DV-SDK-008 — OrganizationServiceContext

**Answer:** `OrganizationServiceContext`

**Explanation / memory hook:** Tracked changes are committed with `SaveChanges()`.

**Origin:** `GAP`

### DV-SDK-009 — OrganizationServiceContext SaveChanges

**Answer:** `SaveChanges()`

**Origin:** `GAP`

### DV-SDK-010 — CodeActivity

**Answer:** `System.Activities.CodeActivity`

**Explanation / memory hook:** This is separate from an `IPlugin` implementation.

**Origin:** `DOC`

### DV-SDK-011 — CodeActivityContext

**Answer:** `CodeActivityContext`

**Explanation / memory hook:** This was a distractor in your plug-in questions; it belongs to workflow activities, not the IPlugin `Execute(IServiceProvider)` entry point.

**Origin:** `DOC`

### DV-SDK-012 — IWorkflowContext

**Answer:** `IWorkflowContext`

**Origin:** `GAP`

### DV-SDK-013 — OptionSetValue.Value

**Answer:** `choice.Value`

**Origin:** `GAP`

### DV-SDK-014 — Money.Value

**Answer:** `money.Value`

**Origin:** `GAP`

### DV-SDK-015 — AliasedValue

**Answer:** `AliasedValue`

**Origin:** `GAP`

## Model-driven apps — Client API / Xrm syntax

### XRM-001 — formContext

**Answer:** `const formContext = executionContext.getFormContext();`

**Explanation / memory hook:** `Xrm.Page` is deprecated; use the passed execution context and `getFormContext()`.

**Origin:** `DOC`

### XRM-002 — Xrm.Page

**Answer:** `Xrm.Page`

**Explanation / memory hook:** It remains for backward compatibility but is deprecated for new code.

**Origin:** `DOC`

### XRM-003 — form type

**Answer:** `formContext.ui.getFormType()`

**Origin:** `DOC`

### XRM-004 — attribute value

**Answer:** `formContext.getAttribute('logicalname').getValue()`

**Origin:** `GAP`

### XRM-005 — attribute value

**Answer:** `formContext.getAttribute('logicalname').setValue(value)`

**Origin:** `GAP`

### XRM-006 — control visibility

**Answer:** `formContext.getControl('creditlimit').setVisible(false);`

**Origin:** `GAP`

### XRM-007 — required level

**Answer:** `formContext.getAttribute('logicalname').setRequiredLevel('required');`

**Origin:** `GAP`

### XRM-008 — event source

**Answer:** `executionContext.getEventSource()`

**Origin:** `GAP`

### XRM-009 — event args

**Answer:** `executionContext.getEventArgs()`

**Origin:** `GAP`

### XRM-010 — prevent save

**Answer:** `executionContext.getEventArgs().preventDefault();`

**Origin:** `GAP`

### XRM-011 — openErrorDialog

**Answer:** `Xrm.Navigation.openErrorDialog(errorOptions)`

**Origin:** `DOC`

### XRM-012 — openErrorDialog details

**Answer:** `{ message: 'There was an error during the request', details: error.message }`

**Explanation / memory hook:** The `details` property is what enables the downloadable log content.

**Origin:** `DOC`

### XRM-013 — openAlertDialog

**Answer:** `Xrm.Navigation.openAlertDialog(...)`

**Origin:** `DOC`

### XRM-014 — navigateTo

**Answer:** `Xrm.Navigation.navigateTo(pageInput, navigationOptions)`

**Origin:** `DOC`

### XRM-015 — navigateTo result

**Answer:** In the resolved result object, via `savedEntityReference`.

**Origin:** `DOC`

### XRM-016 — Xrm.WebApi create

**Answer:** `Xrm.WebApi.createRecord(entityLogicalName, data)`

**Origin:** `GAP`

### XRM-017 — Xrm.WebApi retrieve

**Answer:** `Xrm.WebApi.retrieveRecord(entityLogicalName, id, options)`

**Origin:** `GAP`

### XRM-018 — Xrm.WebApi retrieve multiple

**Answer:** `Xrm.WebApi.retrieveMultipleRecords(entityLogicalName, options, maxPageSize)`

**Origin:** `DOC`

### XRM-019 — Xrm.WebApi update

**Answer:** `Xrm.WebApi.updateRecord(entityLogicalName, id, data)`

**Origin:** `GAP`

### XRM-020 — Xrm.WebApi delete

**Answer:** `Xrm.WebApi.deleteRecord(entityLogicalName, id)`

**Origin:** `GAP`

### XRM-021 — Xrm.WebApi execute

**Answer:** `Xrm.WebApi.online.execute(request)`

**Origin:** `GAP`

### XRM-022 — Xrm.WebApi executeMultiple

**Answer:** `Xrm.WebApi.online.executeMultiple(requests)`

**Origin:** `GAP`

### XRM-023 — FetchXML

**Answer:** Yes. FetchXML is supported as a Web API query option, including with `retrieveMultipleRecords`.

**Origin:** `DOC`

### XRM-024 — OData

**Answer:** OData v4.0.

**Origin:** `DOC`

### XRM-025 — duplicate detection

**Answer:** `false`

**Explanation / memory hook:** The name is inverted: false means do **not** suppress duplicate detection.

**Origin:** `DOC`

## PCF — interfaces and lifecycle syntax

### PCF-001 — StandardControl

**Answer:** `ComponentFramework.StandardControl<IInputs, IOutputs>`

**Origin:** `DOC`

### PCF-002 — lifecycle

**Answer:** `init`, `updateView`, `getOutputs`, `destroy`

**Explanation / memory hook:** `getOutputs` is optional; the others are required for a standard code component.

**Origin:** `DOC`

### PCF-003 — init signature

**Answer:** `init(context, notifyOutputChanged, state, container): void`

**Origin:** `DOC`

### PCF-004 — init

**Answer:** Initialize the component instance, register handlers, create UI, and perform initialization work.

**Explanation / memory hook:** Dataset values should be handled in `updateView`, not initialized in `init`.

**Origin:** `DOC`

### PCF-005 — notifyOutputChanged

**Answer:** `notifyOutputChanged()`

**Explanation / memory hook:** The callback is supplied to `init`.

**Origin:** `DOC`

### PCF-006 — getOutputs

**Answer:** `getOutputs()`

**Origin:** `DOC`

### PCF-007 — getOutputs syntax

**Answer:** `return { value: this._value };`

**Origin:** `GAP`

### PCF-008 — updateView

**Answer:** `updateView(context)`

**Explanation / memory hook:** Think host → component.

**Origin:** `DOC`

### PCF-009 — direction

**Answer:** `updateView`: into; `getOutputs`: out of.

**Origin:** `DOC`

### PCF-010 — destroy

**Answer:** `destroy()`

**Origin:** `DOC`

### PCF-011 — manifest

**Answer:** `ControlManifest.Input.xml`

**Origin:** `DOC`

### PCF-012 — manifest property usage

**Answer:** `bound`

**Origin:** `DOC`

### PCF-013 — manifest input property

**Answer:** `input`

**Origin:** `GAP`

### PCF-014 — generated types

**Answer:** `IInputs` and `IOutputs` from `generated/ManifestTypes`.

**Origin:** `DOC`

### PCF-015 — context.webAPI

**Answer:** `context.webAPI`

**Origin:** `GAP`

### PCF-016 — context.parameters

**Answer:** `context.parameters.sampleProperty`

**Explanation / memory hook:** For a field value you commonly read its `.raw` member.

**Origin:** `GAP`

### PCF-017 — raw value

**Answer:** `context.parameters.sampleProperty.raw`

**Origin:** `GAP`

### PCF-018 — index.ts

**Answer:** `index.ts`

**Origin:** `DOC`

### PCF-019 — resources

**Answer:** CSS, image resources, and `.resx` localization resources.

**Origin:** `GAP`

---

# Current Microsoft Learn references used for gap filling

- PL-400 study guide: https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/pl-400
- Power Fx delegation overview: https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/delegation-overview
- Power Fx `With`: https://learn.microsoft.com/en-us/power-platform/power-fx/reference/function-with
- Large canvas apps / `App.Formulas`: https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/working-with-large-apps
- Efficient calculations / `Concurrent`: https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/efficient-calculations
- Dataverse low-code plug-ins: https://learn.microsoft.com/en-us/power-apps/maker/data-platform/low-code-plug-ins
- Low-code plug-in Power Fx: https://learn.microsoft.com/en-us/power-apps/maker/data-platform/low-code-plug-ins-powerfx
- Create Dataverse Functions: https://learn.microsoft.com/en-us/power-apps/maker/data-platform/functions-create
- Dataverse SDK / Organization service: https://learn.microsoft.com/en-us/power-apps/developer/data-platform/org-service/overview
- Client API form context: https://learn.microsoft.com/en-us/power-apps/developer/model-driven-apps/clientapi/clientapi-form-context
- `Xrm.WebApi`: https://learn.microsoft.com/en-us/power-apps/developer/model-driven-apps/clientapi/reference/xrm-webapi
- PCF `StandardControl`: https://learn.microsoft.com/en-us/power-apps/developer/component-framework/reference/control
- PCF code component lifecycle: https://learn.microsoft.com/en-us/power-apps/developer/component-framework/custom-controls-overview

## Scope decision

This file intentionally does **not** try to reproduce the complete PL-400 exam bank. It narrows the source material to the areas most useful for a syntax-recall app: Power Fx, Dataverse SDK classes/interfaces, plug-in execution/context syntax, model-driven Client API methods, Dataverse Power Fx server logic, custom API types, and PCF interfaces/lifecycle. Pure ALM, environment administration, security configuration, custom-connector policy, and general Power Automate architecture questions were excluded unless they directly supported one of those syntax surfaces.
